import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { Brackets } from "typeorm";
import { isDirectAttribute } from "../lib/utils";

export class ProductService {
    // Initialize the product repository using the AppDataSource
    private productRepository = AppDataSource.getRepository(Product);

    // Function to fetch products with filters
    async getProductsWithFilters(queryParams: any) {
        // Destructure query parameters from the input
        const { name, skip, take, sort, ...otherFilters } = queryParams;
        // Parse pagination parameters with default values
        const paginationSkip = parseInt(skip) || 0;
        const paginationTake = parseInt(take) || 10;

        // Build the base query for products
        let query = this.productRepository.createQueryBuilder("product")
            .skip(paginationSkip)
            .take(paginationTake);

        // Add a WHERE condition for 'name' filter
        if (name) {
            query = query.andWhere("product.name = :name", { name });
        }

        // Process additional filters
        const filterEntries = Object.entries(otherFilters);
        if (filterEntries.length > 0) {
            const filterConditions = filterEntries.map(([key, values]) => {
                const filterValues = Array.isArray(values) ? values : [values];
                const subQuery = new Brackets(subQb => {
                    if (isDirectAttribute(key)) {
                        subQb.where(`product.${key} IN (:...${key})`, { [key]: filterValues });
                    } else {
                        filterValues.forEach((value, index) => {
                            subQb.orWhere(`json_extract(product.attributes, '$.${key}') = :${key}${index}`, { [`${key}${index}`]: value });
                        });
                    }
                });
                return subQuery;
            });

            query = query.andWhere(new Brackets(qb => {
                filterConditions.forEach(condition => {
                    qb.orWhere(condition);
                });
            }));
        }

        // Add sorting
        if (sort && typeof sort === "string") {
            const [field, order] = sort.split(':');
            if (field && order) {
                if (isDirectAttribute(field)) {
                    query = query.orderBy(`product.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
                } else {
                    query = query.addOrderBy(`json_extract(product.attributes, '$.${field}')`, order.toUpperCase() as 'ASC' | 'DESC');
                }
            }
        }

        // Execute the query and retrieve products with pagination
        const [products, total] = await query.getManyAndCount();
        return {
            data: products,
            total,
            skip: paginationSkip,
            take: paginationTake,
        };
    }

    // Function to fetch distinct values for a product
    async getProductDistinctValues(productName: string) {
        const regularColumns = ["name", "description", "price"];
        const regularColumnsDistinctValues: Record<string, any[]> = {};

        // Fetch distinct values for regular columns
        for (const column of regularColumns) {
            const distinctValuesQuery = await this.productRepository
                .createQueryBuilder("product")
                .select(`DISTINCT product.${column}`)
                .where("product.name = :productName", { productName })
                .getRawMany();

            regularColumnsDistinctValues[column] = distinctValuesQuery.map((value) => column === 'price' ? parseFloat(value[column]) : value[column]);
            regularColumnsDistinctValues[column].sort();
        }

        // Fetch products to extract distinct values from JSON-type attributes
        const products = await this.productRepository
            .createQueryBuilder("product")
            .where("product.name = :productName", { productName })
            .getMany();

        const attributesDistinctValues: Record<string, any[]> = {};
        for (const product of products) {
            for (const key of Object.keys(product.attributes || {})) {
                attributesDistinctValues[key] = [...new Set([...(attributesDistinctValues[key] || []), product?.attributes![key]])];
                attributesDistinctValues[key].sort();
            }
        }

        // Combine distinct values for regular columns and attributes
        const distinctValues = {
            ...regularColumnsDistinctValues,
            ...attributesDistinctValues,
        };

        // Sort each array of values in the distinctValues object
        for (const key of Object.keys(distinctValues)) {
            distinctValues[key].sort((a, b) => a - b);
        }

        return {
            productName,
            distinctValues,
        };
    }

    // Function to fetch product quantities
    async getProductQuantities() {
        const productQuantities = await this.productRepository
            .createQueryBuilder("product")
            .select("product.name")
            .addSelect("COUNT(product.id)", "quantity")
            .groupBy("product.name")
            .getRawMany();

        // Map raw results to desired format
        return productQuantities.map(({ product_name, quantity }) => ({
            name: product_name,
            quantity: parseInt(quantity),
        }));
    }
}
