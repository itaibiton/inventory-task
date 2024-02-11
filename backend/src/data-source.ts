import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import * as fs from "fs";
import * as path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [Product],
    synchronize: true,
    logging: false,
});

async function seedDatabase() {
    const productRepository = AppDataSource.getRepository(Product);

    // Check if products already exist to prevent re-seeding on every restart
    const count = await productRepository.count();
    if (count === 0) {
        const productsData = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
        const products = JSON.parse(productsData);

        for (const productData of products) {
            let product = new Product();
            product.name = productData.name;
            product.description = productData.description;
            product.price = productData.price;
            // if (product.attributes) {
            product.attributes = productData.attributes;
            // }

            await productRepository.save(product);
        }

        console.log("Products have been seeded.");
    }
}

// Extend the data source initialization to include the seeding process
AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");

    // Seed the database with product data
    await seedDatabase();
}).catch(error => console.log("Error during Data Source initialization:", error));
