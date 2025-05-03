const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');
const cheerio = require('cheerio');
const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');
const PQueue = require('p-queue').default;

const userAgent = new UserAgent().toString();
const queue = new PQueue({ concurrency: 3 });

console.log(process.env.LOGIN)
console.log(process.env.PASSWORD)

// Конфигурация
const BASE_URL = 'https://zepro.pro';
const LOGIN_URL = BASE_URL + '/en/';
const SUBCATEGORIES_URL = BASE_URL + '/en/auto-dalas/';
const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const OUTPUT_FILE = 'products.json';
const MAX_TEST_CATEGORIES = 2; // Тест: только 1 подкатегория
const MAX_TEST_PRODUCTS = 10;   // Тест: только 3 товара

const CREDS = {
  email: process.env.LOGIN,
  password: process.env.PASSWORD
};

// 1. Логин и сохранение кук
async function loginAndSaveCookies() {
  console.log('🔄 Запуск браузера для авторизации...');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    ignoreHTTPSErrors: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    console.log(`🌐 Перехожу на страницу входа: ${LOGIN_URL}`);
    await page.goto(LOGIN_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Делаем скриншот для отладки
    await page.screenshot({ path: 'before_login.png' });

    console.log('🔑 Ввожу учетные данные...');
    await page.type('#email', CREDS.email, { delay: 50 });
    await page.type('#pass', CREDS.password, { delay: 50 });

    // Скриншот перед отправкой
    await page.screenshot({ path: 'before_submit.png' });

    console.log('⏳ Отправляю форму...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('#submit_login')
    ]);

    // Проверяем успешность входа
    const loginError = await page.$('.error-message');
    if (loginError) {
      const errorText = await page.evaluate(el => el.textContent, loginError);
      throw new Error(`Ошибка входа: ${errorText}`);
    }

    // Скриншот после входа
    await page.screenshot({ path: 'after_login.png' });

    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
    console.log(`🍪 Куки сохранены в ${COOKIES_FILE}`);

    return cookies;
  } catch (error) {
    console.error('❌ Ошибка авторизации:', error);
    await page.screenshot({ path: 'login_error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

// 2. Проверка авторизации
async function checkAuth() {
  if (!fs.existsSync(COOKIES_FILE)) return false;

  try {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf-8'));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setCookie(...cookies);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const authCheck = await page.$('.user-profile');
    await browser.close();
    return !!authCheck;
  } catch (e) {
    return false;
  }
}

// 2. Парсинг подкатегорий
async function getSubcategories() {
  console.log(`🔍 Поиск подкатегорий...`);
  try {
    const { data } = await axios.get(SUBCATEGORIES_URL, {
      headers: { 'User-Agent': userAgent },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const subcategories = [];

    $('.CmListSectBl ul.CmListSect li a').each((_, el) => {
      const url = BASE_URL + $(el).attr('href');
      if (url) {
        subcategories.push({
          name: $(el).text().trim(),
          url: url
        });
      }
    });

    console.log(`📂 Найдено ${subcategories.length} подкатегорий`);
    return subcategories.slice(0, MAX_TEST_CATEGORIES);
  } catch (error) {
    console.error('❌ Ошибка при получении подкатегорий:', error);
    throw error;
  }
}

// 3. Парсинг ссылок на товары
async function getProductLinks(subcategoryUrl) {
  console.log(`🛒 Поиск товаров в ${subcategoryUrl}`);
  try {
    const { data } = await axios.get(subcategoryUrl, {
      headers: { 'User-Agent': userAgent },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const links = [];

    $('a.CmNameInfoWrapBl').each((_, el) => {
      const href = $(el).attr('href');
      if (href) links.push(BASE_URL + href);
    });

    console.log(`🔗 Найдено ${links.length} товаров`);
    return links.slice(0, MAX_TEST_PRODUCTS);
  } catch (error) {
    console.error('❌ Ошибка при получении товаров:', error);
    throw error;
  }
}

// 4. Парсинг деталей товара
async function parseProduct(cluster, productUrl, categoryName) {
  console.log(`🔎 Обработка товара: ${productUrl}`);
  try {
    return await cluster.execute(productUrl, async ({ page, data: url }) => {
      console.log(`➡️ Переход на страницу товара...`);
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 20000 
      });

      console.log(`📊 Извлечение данных...`);
      const data = await page.evaluate(() => {
        return {
          name: document.querySelector('.cmProdName')?.textContent?.trim() || null,
          price: document.querySelector('.CmPriceNum span')?.textContent?.trim() || null,
          url: window.location.href
        };
      });

      return { 
        ...data, 
        category: categoryName,
        timestamp: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${productUrl}:`, error);
    return null;
  }
}

// 5. Главная функция
(async () => {
  console.log('🟢 Запуск парсера...');
  let cluster;

  try {
    console.log('🔍 Проверка авторизации...');
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
      console.log('🔐 Требуется авторизация');
      await loginAndSaveCookies();
    } else {
      console.log('✅ Уже авторизован');
    }

    if (!fs.existsSync(COOKIES_FILE)) {
      console.log('🔐 Требуется авторизация...');
      await loginAndSaveCookies();
    }
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf-8'));
    console.log('🔑 Куки загружены');

    // Б. Настройка кластера
    console.log('⚙️ Настройка кластера Puppeteer...');
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 2, // Минимум для теста
      puppeteerOptions: { 
        headless: false, // Видим процесс
        timeout: 30000,
        args: ['--no-sandbox']
      },
      timeout: 30000,
      workerCreationDelay: 2000, // Задержка между созданием воркеров
      retryLimit: 1,
      retryDelay: 5000
    });

    // В. Загрузка кук
    await cluster.task(async ({ page }) => {
      await page.setCookie(...cookies);
      await page.setUserAgent(userAgent);
      await page.setViewport({ width: 1280, height: 800 });
    });

    // Г. Парсинг данных
    console.log('🔄 Получение подкатегорий...');
    const subcategories = await getSubcategories();
    const allProducts = [];

    for (const subcat of subcategories) {
      console.log(`\n📂 Подкатегория: ${subcat.name}`);
      const productLinks = await getProductLinks(subcat.url);
    
      const tasks = productLinks.map(link => queue.add(async () => {
        const product = await parseProduct(cluster, link, subcat.name);
        if (product) {
          allProducts.push(product);
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
          console.log(`✅ Успешно: ${product.name}`);
        }
        await new Promise(resolve => setTimeout(resolve, 800)); // небольшая пауза
      }));
    
      await Promise.all(tasks); // ожидание завершения очереди
    }

    // Д. Сохранение результатов
    if (allProducts.length > 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
      console.log(`\n💾 Результаты сохранены в ${OUTPUT_FILE}`);
      console.log('Пример данных:', allProducts[0]);
    } else {
      console.log('\n⚠️ Данные не получены! Проверьте логи выше.');
    }

  } catch (error) {
    console.error('🔥 Критическая ошибка:', error);
  } finally {
    console.log('🛑 Завершение работы...');
    if (cluster) await cluster.close();
    process.exit();
  }
})();