require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const userAgents = require('user-agents');

puppeteer.use(StealthPlugin());

const CREDS = {
  login: process.env.LOGIN,
  password: process.env.PASSWORD
};

const getRandomUserAgent = () => new userAgents().toString();

const stealthConfig = {
  languages: ['en-US', 'en'],
  vendor: 'Google Inc.',
  viewport: {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    isMobile: false
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} failed. Retrying...`);
      await sleep(delay);
    }
  }
}

async function parseModifications(page, modelLink) {
  return await retry(async () => {
    await page.goto(new URL(modelLink, 'https://zepro.pro').href, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    return await page.$$eval('.CmModelLink', mods => mods.map(mod => {
      const getText = (selector) => mod.querySelector(selector)?.textContent?.trim() || '';
      const getPower = (selector) => mod.querySelector(selector)?.textContent?.match(/\d+/)?.[0] || '';
      const driveImg = mod.querySelector('.CmDriveBl img');
      return {
        modification: getText('.CmModelNameLiter'),
        engine: {
          code: getText('.CmEngTitTxt').split(',').pop().trim(),
          type: getText('.eColPetrol').replace(/,/g, '').trim(),
          power_kw: getPower('.CmKwBl b'),
          power_hp: getPower('.CmHpBl b')
        },
        production_years: getText('.CmYearFull'),
        drive_type: driveImg ? driveImg.title : '',
        link: mod.href
      };
    }));
  });
}

(async () => {
  let browser;
  try {
    const userAgent = getRandomUserAgent();
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        `--lang=${stealthConfig.languages[0]}`
      ],
      timeout: 60000
    });

    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.setViewport(stealthConfig.viewport);

    await retry(async () => {
      await page.goto('https://zepro.pro/en/', {
        waitUntil: 'networkidle2',
        timeout: 60000,
        referer: 'https://google.com/'
      });
      await page.type('#email', CREDS.login);
      await page.type('#pass', CREDS.password);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button[type="submit"]')
      ]);
    });

    await page.waitForSelector('.mbuttext_x');
    const brandsData = await page.$$eval('a.mbut_x', links => 
      links.map(link => ({
        name: link.querySelector('.mbuttext_x').textContent.trim(),
        logo_url: window.getComputedStyle(link.querySelector('.mbutlogo_x'))
          .backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1],
        url: link.href
      }))
    );

    for (const brand of brandsData) {
      console.log(`Парсинг бренда: ${brand.name}`);

      await retry(async () => {
        await page.goto(brand.url, { waitUntil: 'networkidle2' });
      });

      try {
        await page.click('.slRight');
        await sleep(2000);
      } catch {
        console.log('Список моделей уже открыт');
      }

      const models = await page.$$eval('a.ModBox', models => 
        models.map(model => ({
          name: model.dataset.mname,
          body: model.querySelector('i')?.textContent.trim() || '',
          years: model.querySelector('.ModYear')?.textContent.trim() || '',
          image: (model.getAttribute('style')?.match(/url\(["']?(.*?)["']?\)/) || [])[1] || '',
          link: model.href
        }))
      );

      for (const model of models) {
        console.log(`  Модель: ${model.name}`);
        await sleep(1000 + Math.random() * 2000);
        model.modifications = await parseModifications(page, model.link);
        console.log(`    Модификаций найдено: ${model.modifications.length}`);
      }

      brand.models = models;
      console.log(`✅ Готово: ${brand.name}`);
      await sleep(2000 + Math.random() * 2000);
    }

    fs.writeFileSync('full_data.json', JSON.stringify(brandsData, null, 2));
    console.log('Данные успешно сохранены!');

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    if (browser) await browser.close();
  }
})();
