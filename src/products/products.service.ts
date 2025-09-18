// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Make } from 'src/entities/make.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
import { Model } from 'src/entities/model.entity';
import { Product } from 'src/entities/product.entity';
import { Repository, Like, In } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Make)
    private makeRepository: Repository<Make>,
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(ModelModification)
    private modificationRepository: Repository<ModelModification>,
  ) {}

  // async getCatalogProducts(params: {
  //   categoryId: number;
  //   makeIdNum?: number;
  //   modelIdNum?: number;
  //   modificationIdNum?: number;
  //   manufacturerIds?: number[];
  //   warehouseIds?: number[];
  //   sortBy?: 'availability' | 'price' | '';
  //   sortDir?: 'ASC' | 'DESC';
  //   page?: number;
  //   limit?: number;
  // }) {
  //   const {
  //     categoryId,
  //     makeIdNum,
  //     modelIdNum,
  //     modificationIdNum,
  //     manufacturerIds,
  //     warehouseIds,
  //     sortBy = '',
  //     sortDir = 'ASC',
  //     page = 1,
  //     limit = 24,
  //   } = params;

  //   const safeLimit = Math.min(Math.max(limit || 24, 1), 100);
  //   const safePage = Math.max(page || 1, 1);
  //   // const safeSortDir = sortDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  //   const offset = (safePage - 1) * safeLimit;

  //   // JOINS
  //   const joins: string[] = [
  //     'JOIN Manufacturers mfr ON mfr.id = p.manufacturer_id',
  //     'LEFT JOIN ProductStock ps ON ps.product_id = p.id',
  //     `LEFT JOIN (
  //       SELECT product_id, MIN(photo_url) AS photo_url
  //       FROM ProductPhotos
  //       GROUP BY product_id
  //      ) pp ON pp.product_id = p.id`,
  //   ];

  //   if (modificationIdNum || modelIdNum || makeIdNum) {
  //     joins.push(
  //       'LEFT JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id',
  //     );
  //     joins.push(
  //       'LEFT JOIN ModelModifications mm ON mm.id = pvc.modification_id',
  //     );
  //     joins.push('LEFT JOIN Models mdl ON mdl.id = mm.model_id');
  //     joins.push('LEFT JOIN Makes mk ON mk.id = mdl.make_id');
  //   }
  //   if (warehouseIds?.length) {
  //     joins.push('LEFT JOIN Warehouses w ON w.id = ps.warehouse_id');
  //   }
  //   const joinClause = joins.join('\n');

  //   // PARAMS
  //   const conditions: string[] = ['p.category_id = ?'];
  //   const paramsWhere: any[] = [categoryId];

  //   if (manufacturerIds?.length) {
  //     conditions.push(
  //       `p.manufacturer_id IN (${manufacturerIds.map(() => '?').join(',')})`,
  //     );
  //     paramsWhere.push(...manufacturerIds);
  //   }
  //   if (makeIdNum) {
  //     conditions.push('mk.id = ?');
  //     paramsWhere.push(makeIdNum);
  //   }
  //   if (modelIdNum) {
  //     conditions.push('mdl.id = ?');
  //     paramsWhere.push(modelIdNum);
  //   }
  //   if (modificationIdNum) {
  //     conditions.push(`
  //       EXISTS (
  //         SELECT 1
  //         FROM ProductVehicleCompatibility pvc
  //         WHERE pvc.product_id = p.id AND pvc.modification_id = ?
  //       )
  //     `);
  //     paramsWhere.push(modificationIdNum);
  //   }

  //   if (warehouseIds?.length) {
  //     conditions.push(`w.id IN (${warehouseIds.map(() => '?').join(',')})`);
  //     paramsWhere.push(...warehouseIds);
  //   }

  //   paramsWhere.push(limit, offset);

  //   const whereClause = conditions.length
  //     ? `WHERE ${conditions.join(' AND ')}`
  //     : '';

  //   // SORT
  //   const allowedSortFields = ['availability', 'price'];
  //   const allowedSortDirs = ['ASC', 'DESC'];

  //   const sortField = allowedSortFields.includes(sortBy) ? sortBy : '';
  //   const direction = allowedSortDirs.includes(sortDir) ? sortDir : 'ASC';

  //   let orderClause = '';
  //   if (sortField === 'price') {
  //     orderClause = `ORDER BY MIN(ps.price) ${direction}`;
  //   } else if (sortField === 'availability') {
  //     orderClause = `ORDER BY SUM(ps.quantity) ${direction}`;
  //   }

  //   const validatedLimit = Number.isInteger(limit) ? limit : 24;
  //   const validatedOffset = Number.isInteger(offset) ? offset : 0;

  //   const query = `
  //   SELECT
  //     p.id,
  //     p.name,
  //     p.sku,
  //     pp.photo_url,
  //     mfr.name AS manufacturer_name
  //   FROM Products p
  //   ${joinClause}
  //   ${whereClause}
  //   GROUP BY p.id, p.name, p.sku, pp.photo_url, mfr.name
  //   ${orderClause}
  //   LIMIT ${validatedLimit} OFFSET ${validatedOffset};
  //   `;

  //   const countQuery = `
  //       SELECT COUNT(DISTINCT p.id) as total
  //       FROM Products p
  //       ${joinClause}
  //       ${whereClause}
  //     `;

  //     console.log(query)
  //     console.log(paramsWhere)
  //   const [result, totalCountQuery] = await Promise.all([
  //     this.productRepository.query(query, paramsWhere),
  //     this.productRepository.query(countQuery, paramsWhere.slice(0, -2)),
  //   ]);

  //   let warehouseDetails = [];
  //   if (result.length > 0) {
  //     const productIds = result.map((p) => p.id);

  //     warehouseDetails = await this.productRepository.query(
  //       `
  //   SELECT
  //     ps.product_id,
  //     JSON_OBJECT(
  //       'warehouse_id', w.id,
  //       'warehouse', w.name,
  //       'quantity', ps.quantity,
  //       'price', ps.price,
  //       'min_order_quantity', ps.min_order_quantity,
  //       'returnable', ps.returnable,
  //       'delivery_time', ps.delivery_time
  //     ) AS detail
  //   FROM ProductStock ps
  //   JOIN Warehouses w ON w.id = ps.warehouse_id
  //   WHERE ps.product_id IN (?)
  //   `,
  //       [productIds],
  //     );
  //   }

  //   const totalCount = totalCountQuery[0]?.total ?? 0;
  //   return { result, totalCount, warehouseDetails };
  // }

  async getCatalogProducts(params: {
    categoryId: number;
    makeIdNum?: number;
    modelIdNum?: number;
    modificationIdNum?: number;
    manufacturerIds?: number[];
    warehouseIds?: number[];
    sortBy?: 'availability' | 'price' | '';
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }) {
    const {
      categoryId,
      makeIdNum,
      modelIdNum,
      modificationIdNum,
      manufacturerIds,
      warehouseIds,
      sortBy = '',
      sortDir = 'ASC',
      page = 1,
      limit = 24,
    } = params;

    const safeLimit = Math.min(Math.max(limit || 24, 1), 100);
    const safePage = Math.max(page || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const conditions: string[] = ['p.category_id = ?'];
    const paramsWhere: any[] = [categoryId];

    if (manufacturerIds?.length) {
      conditions.push(
        `p.manufacturer_id IN (${manufacturerIds.map(() => '?').join(',')})`,
      );
      paramsWhere.push(...manufacturerIds);
    }
    if (modificationIdNum) {
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM ProductVehicleCompatibility pvc
          WHERE pvc.product_id = p.id
          AND pvc.modification_id = ?
          )
          `);
      paramsWhere.push(modificationIdNum);
    } else if (modelIdNum) {
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM ProductVehicleCompatibility pvc
          JOIN ModelModifications mm ON mm.id = pvc.modification_id
          WHERE pvc.product_id = p.id
          AND mm.model_id = ?
          )
          `);
      paramsWhere.push(modelIdNum);
    } else if (makeIdNum) {
      conditions.push(`
            EXISTS (
              SELECT 1
              FROM ProductVehicleCompatibility pvc
              JOIN ModelModifications mm ON mm.id = pvc.modification_id
              JOIN Models mdl ON mdl.id = mm.model_id
              WHERE pvc.product_id = p.id
                AND mdl.make_id = ?
            )
          `);
      paramsWhere.push(makeIdNum);
    }

    if (warehouseIds?.length) {
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM ProductStock ps
          WHERE ps.product_id = p.id
            AND ps.warehouse_id IN (${warehouseIds.map(() => '?').join(',')})
        )
      `);
      paramsWhere.push(...warehouseIds);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // SORT
    const allowedSortFields = ['availability', 'price'];
    const allowedSortDirs = ['ASC', 'DESC'];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : '';
    const direction = allowedSortDirs.includes(sortDir) ? sortDir : 'ASC';

    let orderClause = '';
    if (sortField === 'price') {
      orderClause = `ORDER BY MIN(ps.price) ${direction}`;
    } else if (sortField === 'availability') {
      orderClause = `ORDER BY SUM(ps.quantity) ${direction}`;
    }

    const validatedLimit = Number.isInteger(limit) ? limit : 24;
    const validatedOffset = Number.isInteger(offset) ? offset : 0;

    const idJoinClause = [
      'LEFT JOIN ProductStock ps ON ps.product_id = p.id',
      ...(modificationIdNum || modelIdNum || makeIdNum
        ? [
            'LEFT JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id',
            'LEFT JOIN ModelModifications mm ON mm.id = pvc.modification_id',
            'LEFT JOIN Models mdl ON mdl.id = mm.model_id',
            'LEFT JOIN Makes mk ON mk.id = mdl.make_id',
          ]
        : []),
      ...(warehouseIds?.length
        ? ['LEFT JOIN Warehouses w ON w.id = ps.warehouse_id']
        : []),
    ].join('\n');

    const idQuery = `
      SELECT DISTINCT p.id
      FROM Products p
      ${idJoinClause}
      ${whereClause}
      LIMIT ${safeLimit} OFFSET ${offset};
    `;

    const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM Products p
        ${idJoinClause}
        ${whereClause}
      `;

    const [idsRaw, totalCountRaw] = await Promise.all([
      this.productRepository.query(idQuery, paramsWhere),
      this.productRepository.query(countQuery, paramsWhere),
    ]);

    const productIds = idsRaw.map((p) => p.id);
    const totalCount = totalCountRaw[0]?.total ?? 0;

    let result = [];
    if (productIds.length > 0) {
      const sortField = ['availability', 'price'].includes(sortBy)
        ? sortBy
        : '';
      const direction = ['ASC', 'DESC'].includes(sortDir) ? sortDir : 'ASC';

      let orderClause = '';
      if (sortField === 'price') {
        orderClause = `ORDER BY MIN(ps.price) ${direction}`;
      } else if (sortField === 'availability') {
        orderClause = `ORDER BY SUM(ps.quantity) ${direction}`;
      }

      const mainQuery = `
      SELECT
        p.id,
        p.name,
        p.sku,
        pp.photo_url,
        mfr.name AS manufacturer_name
      FROM Products p
      JOIN Manufacturers mfr ON mfr.id = p.manufacturer_id
      LEFT JOIN ProductStock ps ON ps.product_id = p.id
      LEFT JOIN (
        SELECT product_id, MIN(photo_url) AS photo_url
        FROM ProductPhotos
        GROUP BY product_id
      ) pp ON pp.product_id = p.id
      WHERE p.id IN (${productIds.map(() => '?').join(',')})
      GROUP BY p.id, p.name, p.sku, pp.photo_url, mfr.name
      ${orderClause};
    `;

      result = await this.productRepository.query(mainQuery, productIds);
    }

    let warehouseDetails = [];
    if (result.length > 0) {
      warehouseDetails = await this.productRepository.query(
        `
    SELECT
      ps.product_id,
      JSON_OBJECT(
        'warehouse_id', w.id,
        'warehouse', w.name,
        'quantity', ps.quantity,
        'price', ps.price,
        'min_order_quantity', ps.min_order_quantity,
        'returnable', ps.returnable,
        'delivery_time', ps.delivery_time
      ) AS detail
    FROM ProductStock ps
    JOIN Warehouses w ON w.id = ps.warehouse_id
    WHERE ps.product_id IN (${productIds.map(() => '?').join(',')})
    `,
        productIds,
      );
    }

    return { result, totalCount, warehouseDetails };
  }

  async getCatalogManufacturers(params: {
    categoryId: number;
    modelId?: number;
    modificationId?: number;
    makeId?: number;
    warehouseId?: number;
  }): Promise<{ id: number; name: string }[]> {
    const { categoryId, modificationId } = params;

    const result = await this.productRepository.query(
      `
    SELECT 
    m.name AS manufacturer_name,
    COUNT(DISTINCT p.id) AS product_count
    FROM Products p
    JOIN Manufacturers m ON p.manufacturer_id = m.id
    WHERE p.category_id = ?
      AND (
        ? IS NULL 
        OR EXISTS (
            SELECT 1
            FROM ProductVehicleCompatibility pvc
            WHERE pvc.product_id = p.id AND pvc.modification_id = ?
        )
    )
    GROUP BY m.id, m.name
    ORDER BY product_count DESC;
    `,
      [categoryId, modificationId ?? null, modificationId ?? null],
    );

    return result;
  }

  async getCatalogWarehouses(params: {
    categoryId: number;
    modelId?: number;
    modificationId?: number;
    makeId?: number;
    warehouseId?: number;
  }): Promise<{ id: number; name: string }[]> {
    const { categoryId, modificationId } = params;

    const result = await this.productRepository.query(
      `
    SELECT 
    w.name AS warehouse_name,
    COUNT(DISTINCT p.id) AS product_count
    FROM Products p
    JOIN ProductStock ps ON ps.product_id = p.id
    JOIN Warehouses w ON ps.warehouse_id = w.id
    WHERE p.category_id = ?
      AND (
        ? IS NULL 
        OR EXISTS (
            SELECT 1
            FROM ProductVehicleCompatibility pvc
            WHERE pvc.product_id = p.id AND pvc.modification_id = ?
        )
    )
    GROUP BY w.id, w.name
    ORDER BY product_count DESC;
    `,
      [categoryId, modificationId ?? null, modificationId ?? null],
    );

    return result;
  }

  async getProductDetailsBySku(sku: string, lang: 'ru' | 'en' | 'lv') {
    const validLangs = ['ru', 'en', 'lv'];
    const columnSuffix = validLangs.includes(lang) ? lang : 'en';
    const product = await this.productRepository.findOne({
      where: { sku },
    });

    if (!product) return null;

    const productId = product.id;

    const [
      attributes,
      photos,
      [manufacturerRow],
      stock,
      oeNumbers,
      compatibility,
      equivalentsData,
    ] = await Promise.all([
      this.productRepository.query(
        `SELECT name_${columnSuffix} AS name, value_${columnSuffix} AS value 
         FROM ProductAttributes 
         WHERE product_id = ?`,
        [productId],
      ),
      this.productRepository.query(
        `SELECT photo_url, is_main FROM ProductPhotos WHERE product_id = ?`,
        [productId],
      ),
      this.productRepository.query(
        `SELECT mfr.name AS manufacturer_name
       FROM Manufacturers mfr
       JOIN Products p ON mfr.id = p.manufacturer_id
       WHERE p.id = ?`,
        [productId],
      ),
      this.productRepository.query(
        `SELECT w.name AS warehouse, ps.quantity, ps.price, ps.delivery_time, ps.min_order_quantity, ps.returnable
       FROM ProductStock ps
       JOIN Warehouses w ON w.id = ps.warehouse_id
       WHERE ps.product_id = ?`,
        [productId],
      ),
      this.productRepository.query(
        `SELECT mk.name AS make, po.oe_number
       FROM ProductOENumbers po
       JOIN Makes mk ON mk.id = po.make_id
       WHERE po.product_id = ?`,
        [productId],
      ),
      this.productRepository.query(
        `SELECT pvc.product_id, mk.name AS make, mk.logo_url AS make_logo, mdl.name AS model, mm.name AS modification, mm.power, mm.year_from, mm.year_to
       FROM ProductVehicleCompatibility pvc
       JOIN ModelModifications mm ON mm.id = pvc.modification_id
       JOIN Models mdl ON mdl.id = mm.model_id
       JOIN Makes mk ON mk.id = mdl.make_id
       WHERE pvc.product_id = ?`,
        [productId],
      ),
      (async () => {
        const productRow = await this.productRepository.findOne({
          where: { id: productId },
        });
        if (!productRow) return [];
        const mainSku = productRow.sku;

        const { result } = await this.searchBySku(mainSku, 1, 100);
        return result.filter((item) => item.sku !== mainSku);
      })(),
    ]);

    return {
      ...product,
      attributes,
      photos,
      manufacturer_name: manufacturerRow?.manufacturer_name || null,
      stock,
      oeNumbers,
      compatibility,
      equivalentsData,
    };
  }

  async getEquivalentProducts(params: {
    productId: number;
    includeOriginalSku?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      productId,
      includeOriginalSku = true,
      page = 1,
      limit = 24,
    } = params;

    const safeLimit = Math.min(Math.max(limit || 24, 1), 100);

    // 1) собрать аналоги SKU
    const equivalents: Array<{ sku: string }> =
      await this.productRepository.query(
        `
    SELECT TRIM(sku) AS sku
    FROM ProductEquivalents
    WHERE product_id = ?
      AND sku IS NOT NULL
      AND sku <> ''
    `,
        [productId],
      );

    // опционально добавить исходный SKU товара
    let originalSku: string | null = null;
    if (includeOriginalSku) {
      const orig = await this.productRepository.query(
        `SELECT TRIM(sku) AS sku FROM Products WHERE id = ?`,
        [productId],
      );
      originalSku = orig?.[0]?.sku ?? null;
    }

    const rawSkus = [
      ...new Set([
        ...equivalents.map((r) => r.sku),
        ...(originalSku ? [originalSku] : []),
      ]),
    ].filter(Boolean) as string[];

    if (rawSkus.length === 0) {
      return {
        result: [],
        totalCount: 0,
        page: 1,
        limit: safeLimit,
        warehouseDetails: [],
      };
    }

    // 2) нормализуем SKU: убираем пробелы и приводим к верхнему регистру
    const normalizedSkus = rawSkus.map((s) =>
      s.replace(/\s+/g, '').toUpperCase(),
    );

    // 3) общий WHERE: сравниваем по UPPER(REPLACE(p.sku,' ',''))
    const whereParts: string[] = [
      `UPPER(REPLACE(p.sku, ' ', '')) IN (${normalizedSkus.map(() => '?').join(',')})`,
    ];
    const whereParams: any[] = [...normalizedSkus];

    const whereClause = `WHERE ${whereParts.join(' AND ')}`;

    // 4) количество
    const countQuery = `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM Products p
    ${whereClause}
  `;
    const [{ total = 0 } = { total: 0 }] = await this.productRepository.query(
      countQuery,
      whereParams,
    );
    const totalCount = Number(total) || 0;

    // 5) пагинация (защита от пустой страницы)
    const lastPage = Math.max(1, Math.ceil(totalCount / safeLimit));
    const safePage = Math.min(Math.max(page || 1, 1), lastPage);
    const offset = (safePage - 1) * safeLimit;

    // id-лист с детерминированным порядком
    const idQuery = `
    SELECT DISTINCT p.id
    FROM Products p
    ${whereClause}
    ORDER BY p.id ASC
    LIMIT ${safeLimit} OFFSET ${offset}
  `;
    const idsRaw = totalCount
      ? await this.productRepository.query(idQuery, whereParams)
      : [];
    const productIds: number[] = idsRaw.map((r: any) => r.id);

    let result: any[] = [];
    if (productIds.length) {
      const mainQuery = `
      SELECT
        p.id,
        p.name,
        p.sku,
        pp.photo_url,
        mfr.name AS manufacturer_name
      FROM Products p
      JOIN Manufacturers mfr ON mfr.id = p.manufacturer_id
      LEFT JOIN ProductStock ps ON ps.product_id = p.id
      LEFT JOIN (
        SELECT product_id, MIN(photo_url) AS photo_url
        FROM ProductPhotos
        GROUP BY product_id
      ) pp ON pp.product_id = p.id
      WHERE p.id IN (${productIds.map(() => '?').join(',')})
      GROUP BY p.id, p.name, p.sku, pp.photo_url, mfr.name
    `;
      result = await this.productRepository.query(mainQuery, productIds);
    }

    // 7) детали по складам
    let warehouseDetails: any[] = [];
    if (productIds.length) {
      const wdQuery = `
      SELECT
        ps.product_id,
        JSON_OBJECT(
          'warehouse_id', w.id,
          'warehouse', w.name,
          'quantity', ps.quantity,
          'price', ps.price,
          'min_order_quantity', ps.min_order_quantity,
          'returnable', ps.returnable,
          'delivery_time', ps.delivery_time
        ) AS detail
      FROM ProductStock ps
      JOIN Warehouses w ON w.id = ps.warehouse_id
      WHERE ps.product_id IN (${productIds.map(() => '?').join(',')})
    `;
      warehouseDetails = await this.productRepository.query(
        wdQuery,
        productIds,
      );
    }

    return {
      result,
      totalCount,
      page: safePage,
      limit: safeLimit,
      warehouseDetails,
    };
  }

  async searchBySku(skuFragment: string, page = 1, limit = 24) {
    const offset = (page - 1) * limit;

    const joins = [
      'JOIN Manufacturers mfr ON mfr.id = p.manufacturer_id',
      'JOIN ProductStock ps ON ps.product_id = p.id',
      `LEFT JOIN (
      SELECT product_id, MIN(photo_url) AS photo_url
      FROM ProductPhotos
      GROUP BY product_id
    ) pp ON pp.product_id = p.id`,
      'LEFT JOIN Warehouses w ON w.id = ps.warehouse_id',
    ];

    // 1. Получаем все sku (введённые + эквиваленты)
    const originalProducts = await this.productRepository.query(
      `SELECT p.id, p.sku FROM Products p WHERE p.sku LIKE ?`,
      [`%${skuFragment}%`],
    );
    const originalProductIds = originalProducts.map((p) => p.id);

    const equivalentSkusRows = originalProductIds.length
      ? await this.productRepository.query(
          `SELECT sku FROM ProductEquivalents WHERE product_id IN (?)`,
          [originalProductIds],
        )
      : [];

    const equivalentSkus = equivalentSkusRows.map((row) => row.sku);

    const allSkusSet = new Set([
      ...originalProducts.map((p) => p.sku),
      ...equivalentSkus,
    ]);
    const allSkus = Array.from(allSkusSet);

    // 2. Общий запрос по всем sku (введённые + эквиваленты)
    const resultQuery = `
    SELECT
      p.id,
      p.name,
      p.sku,
      pp.photo_url,
      mfr.name AS manufacturer_name
    FROM Products p
    ${joins.join('\n')}
    WHERE p.sku IN (${allSkus.map(() => '?').join(',')})
    GROUP BY p.id, p.name, p.sku, ps.price, pp.photo_url, mfr.name
    ORDER BY SUM(ps.quantity) DESC
    LIMIT ? OFFSET ?
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM Products p
    ${joins.join('\n')}
    WHERE p.sku IN (${allSkus.map(() => '?').join(',')})
  `;

    if (allSkus.length === 0) {
      return {
        result: [],
        totalCount: 0,
        warehouseDetails: [],
      };
    }

    const [result, totalCountQuery] = await Promise.all([
      this.productRepository.query(resultQuery, [...allSkus, limit, offset]),
      this.productRepository.query(countQuery, allSkus),
    ]);

    let warehouseDetails = [];
    if (result.length > 0) {
      warehouseDetails = result.length
        ? await this.productRepository.query(
            `
        SELECT
          ps.product_id,
          JSON_OBJECT(
            'warehouse_id', w.id,
            'warehouse', w.name,
            'quantity', ps.quantity,
            'price', ps.price,
            'min_order_quantity', ps.min_order_quantity,
            'returnable', ps.returnable,
            'delivery_time', ps.delivery_time
          ) AS detail
        FROM ProductStock ps
        JOIN Warehouses w ON w.id = ps.warehouse_id
        WHERE ps.product_id IN (${result.map(() => '?').join(',')})
      `,
            result.map((r) => r.id),
          )
        : [];
    }

    const totalCount = totalCountQuery[0]?.total ?? 0;

    return {
      result,
      totalCount,
      warehouseDetails,
    };
  }

  async searchByOem(oemNumber: string, page = 1, limit = 24) {
    const offset = (page - 1) * limit;
    console.log(oemNumber);

    const joins = [
      'JOIN ProductOENumbers po ON po.product_id = p.id',
      'JOIN Manufacturers mfr ON mfr.id = p.manufacturer_id',
      'JOIN ProductStock ps ON ps.product_id = p.id',
      `LEFT JOIN (
      SELECT product_id, MIN(photo_url) AS photo_url
      FROM ProductPhotos
      GROUP BY product_id
    ) pp ON pp.product_id = p.id`,
      'LEFT JOIN Warehouses w ON w.id = ps.warehouse_id',
    ];

    const query = `
    SELECT
      p.id,
      p.name,
      p.sku,
      pp.photo_url,
      mfr.name AS manufacturer_name
    FROM Products p
    ${joins.join('\n')}
    WHERE po.oe_number LIKE ?
    GROUP BY p.id, p.name, p.sku, ps.price, pp.photo_url, mfr.name
    ORDER BY SUM(ps.quantity) DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM Products p
    ${joins.join('\n')}
    WHERE po.oe_number LIKE ?

  `;

    const [result, totalCountQuery] = await Promise.all([
      this.productRepository.query(query, [`%${oemNumber}%`, limit, offset]),
      this.productRepository.query(countQuery, [`%${oemNumber}%]`]),
    ]);

    let warehouseDetails = [];
    if (result.length > 0) {
      const productIds = result.map((p) => p.id);

      warehouseDetails = await this.productRepository.query(
        `
      SELECT
        ps.product_id,
        JSON_OBJECT(
          'warehouse_id', w.id,
          'warehouse', w.name,
          'quantity', ps.quantity,
          'price', ps.price,
          'min_order_quantity', ps.min_order_quantity,
          'returnable', ps.returnable,
          'delivery_time', ps.delivery_time
        ) AS detail
      FROM ProductStock ps
      JOIN Warehouses w ON w.id = ps.warehouse_id
      WHERE ps.product_id IN (${productIds.map(() => '?').join(',')})
    `,
        [...productIds],
      );
    }

    const totalCount = totalCountQuery[0]?.total ?? 0;

    return { result, totalCount, warehouseDetails };
  }
}
