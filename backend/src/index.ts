import express from 'express';
import { AppDataSource } from "./data-source";
import { Product } from "./entity/Product";

AppDataSource.initialize().then(async () => {
    const app = express();
    const port = 3000;

    app.use(express.json()); // Middleware to parse JSON bodies

    // POST route to add a product
    app.post('/products', async (req, res) => {
        // Extract attributes along with other product details
        const { name, description, price, attributes } = req.body;

        try {
            const product = new Product();
            product.name = name;
            product.description = description;
            product.price = price;
            product.attributes = attributes; // Directly assign dynamic attributes

            const productRepository = AppDataSource.getRepository(Product);
            const savedProduct = await productRepository.save(product);

            console.log('Product saved:', savedProduct);
            res.json(savedProduct);
        } catch (error) {
            console.error('Error saving product:', error);
            res.status(500).send('Error saving product');
        }
    });

    app.get('/products/quantities', async (req, res) => {
        try {
            // Use TypeORM's QueryBuilder to aggregate products by name and count them
            const productRepository = AppDataSource.getRepository(Product);
            const productQuantities = await productRepository
                .createQueryBuilder("product")
                .select("product.name")
                .addSelect("COUNT(product.id)", "quantity")
                .groupBy("product.name")
                .getRawMany();

            // Transform the result into the desired format
            const response = productQuantities.reduce((acc, { product_name, quantity }) => {
                acc.push({ name: product_name, quantity: parseInt(quantity) });
                return acc;
            }, []);

            res.json(response);
        } catch (error) {
            console.error('Error fetching product quantities:', error);
            res.status(500).send('Error fetching product quantities');
        }
    });


    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(error => console.log("Error during Data Source initialization", error));
