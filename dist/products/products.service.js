"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("../entities/category.entity");
const make_entity_1 = require("../entities/make.entity");
const model_modification_entity_1 = require("../entities/model-modification.entity");
const model_entity_1 = require("../entities/model.entity");
const product_entity_1 = require("../entities/product.entity");
const typeorm_2 = require("typeorm");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    makeRepository;
    modelRepository;
    modificationRepository;
    constructor(productRepository, categoryRepository, makeRepository, modelRepository, modificationRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.makeRepository = makeRepository;
        this.modelRepository = modelRepository;
        this.modificationRepository = modificationRepository;
    }
    async getCatalogProducts(params) {
        const { categoryId, makeIdNum, modelIdNum, modificationIdNum, manufacturerIds, warehouseIds, sortBy = '', sortDir = 'ASC', page = 1, limit = 24, } = params;
        const safeLimit = Math.min(Math.max(limit || 24, 1), 100);
        const safePage = Math.max(page || 1, 1);
        const offset = (safePage - 1) * safeLimit;
        const conditions = ['p.category_id = ?'];
        const paramsWhere = [categoryId];
        if (manufacturerIds?.length) {
            conditions.push(`p.manufacturer_id IN (${manufacturerIds.map(() => '?').join(',')})`);
            paramsWhere.push(...manufacturerIds);
        }
        if (makeIdNum) {
            conditions.push('mk.id = ?');
            paramsWhere.push(makeIdNum);
        }
        if (modelIdNum) {
            conditions.push('mdl.id = ?');
            paramsWhere.push(modelIdNum);
        }
        if (modificationIdNum) {
            conditions.push('pvc.modification_id = ?');
            paramsWhere.push(modificationIdNum);
        }
        if (warehouseIds?.length) {
            conditions.push(`w.id IN (${warehouseIds.map(() => '?').join(',')})`);
            paramsWhere.push(...warehouseIds);
        }
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';
        const allowedSortFields = ['availability', 'price'];
        const allowedSortDirs = ['ASC', 'DESC'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : '';
        const direction = allowedSortDirs.includes(sortDir) ? sortDir : 'ASC';
        let orderClause = '';
        if (sortField === 'price') {
            orderClause = `ORDER BY MIN(ps.price) ${direction}`;
        }
        else if (sortField === 'availability') {
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
            }
            else if (sortField === 'availability') {
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
            warehouseDetails = await this.productRepository.query(`
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
    `, productIds);
        }
        return { result, totalCount, warehouseDetails };
    }
    async getCatalogManufacturers(params) {
        const { categoryId, modificationId } = params;
        const result = await this.productRepository.query(`
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
    `, [categoryId, modificationId ?? null, modificationId ?? null]);
        return result;
    }
    async getCatalogWarehouses(params) {
        const { categoryId, modificationId } = params;
        const result = await this.productRepository.query(`
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
    `, [categoryId, modificationId ?? null, modificationId ?? null]);
        return result;
    }
    async getProductDetailsBySku(sku, lang) {
        const validLangs = ['ru', 'en', 'lv'];
        const columnSuffix = validLangs.includes(lang) ? lang : 'en';
        const product = await this.productRepository.findOne({
            where: { sku },
        });
        if (!product)
            return null;
        const productId = product.id;
        const [attributes, photos, [manufacturerRow], stock, oeNumbers, compatibility, equivalentsData,] = await Promise.all([
            this.productRepository.query(`SELECT name_${columnSuffix} AS name, value_${columnSuffix} AS value 
         FROM ProductAttributes 
         WHERE product_id = ?`, [productId]),
            this.productRepository.query(`SELECT photo_url, is_main FROM ProductPhotos WHERE product_id = ?`, [productId]),
            this.productRepository.query(`SELECT mfr.name AS manufacturer_name
       FROM Manufacturers mfr
       JOIN Products p ON mfr.id = p.manufacturer_id
       WHERE p.id = ?`, [productId]),
            this.productRepository.query(`SELECT w.name AS warehouse, ps.quantity, ps.price, ps.delivery_time, ps.min_order_quantity, ps.returnable
       FROM ProductStock ps
       JOIN Warehouses w ON w.id = ps.warehouse_id
       WHERE ps.product_id = ?`, [productId]),
            this.productRepository.query(`SELECT mk.name AS make, po.oe_number
       FROM ProductOENumbers po
       JOIN Makes mk ON mk.id = po.make_id
       WHERE po.product_id = ?`, [productId]),
            this.productRepository.query(`SELECT pvc.product_id, mk.name AS make, mk.logo_url AS make_logo, mdl.name AS model, mm.name AS modification, mm.power, mm.year_from, mm.year_to
       FROM ProductVehicleCompatibility pvc
       JOIN ModelModifications mm ON mm.id = pvc.modification_id
       JOIN Models mdl ON mdl.id = mm.model_id
       JOIN Makes mk ON mk.id = mdl.make_id
       WHERE pvc.product_id = ?`, [productId]),
            (async () => {
                const productRow = await this.productRepository.findOne({
                    where: { id: productId },
                });
                if (!productRow)
                    return [];
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
    async searchBySku(skuFragment, page = 1, limit = 24) {
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
        const originalProducts = await this.productRepository.query(`SELECT p.id, p.sku FROM Products p WHERE p.sku LIKE ?`, [`%${skuFragment}%`]);
        const originalProductIds = originalProducts.map((p) => p.id);
        const equivalentSkusRows = originalProductIds.length
            ? await this.productRepository.query(`SELECT sku FROM ProductEquivalents WHERE product_id IN (?)`, [originalProductIds])
            : [];
        const equivalentSkus = equivalentSkusRows.map((row) => row.sku);
        const allSkusSet = new Set([
            ...originalProducts.map((p) => p.sku),
            ...equivalentSkus,
        ]);
        const allSkus = Array.from(allSkusSet);
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
                ? await this.productRepository.query(`
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
      `, result.map((r) => r.id))
                : [];
        }
        const totalCount = totalCountQuery[0]?.total ?? 0;
        return {
            result,
            totalCount,
            warehouseDetails,
        };
    }
    async searchByOem(oemNumber, page = 1, limit = 24) {
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
            warehouseDetails = await this.productRepository.query(`
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
    `, [...productIds]);
        }
        const totalCount = totalCountQuery[0]?.total ?? 0;
        return { result, totalCount, warehouseDetails };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(make_entity_1.Make)),
    __param(3, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(4, (0, typeorm_1.InjectRepository)(model_modification_entity_1.ModelModification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map