import express from 'express';
import { AppDataSource } from "./data-source";
import { Product } from "./entity/Product";

// AppDataSource.initialize().then(async () => {
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

app.get('/products', async (req, res) => {
    const { name, skip, take, ...otherFilters } = req.query;

    const paginationSkip = parseInt(skip as string) || 0;
    const paginationTake = parseInt(take as string) || 10;

    try {
        const productRepository = AppDataSource.getRepository(Product);

        // Initialize the base query with name filter and pagination
        let query = productRepository.createQueryBuilder("product")
            .where("product.name = :name", { name })
            .skip(paginationSkip)
            .take(paginationTake);

        // Apply direct filters (e.g., price, description) if they exist
        const directFilters = ['price', 'description']; // Extend this list as needed
        directFilters.forEach(filter => {
            if (otherFilters[filter]) {
                query = query.andWhere(`product.${filter} = :${filter}`, { [filter]: otherFilters[filter] });
            }
        });

        // Apply filters expected to be within the attributes JSON column
        Object.entries(otherFilters).forEach(([key, value]) => {
            if (!directFilters.includes(key)) { // Ensure it's not a direct filter
                query = query.andWhere(`json_extract(product.attributes, '$.${key}') = :${key}`, { [key]: value });
            }
        });

        const [products, total] = await query.getManyAndCount();

        res.json({
            data: products,
            total,
            skip: paginationSkip,
            take: paginationTake,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
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
// }).catch(error => console.log("Error during Data Source initialization", error));
