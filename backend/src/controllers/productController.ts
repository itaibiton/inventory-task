import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

// Create an instance of the ProductService
const productService = new ProductService();

// Controller function to handle fetching products with filters
export const getProductsWithFilters = async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const { name, skip, take, sort, ...otherFilters } = req.query;

        // Call the ProductService to get products with filters applied
        const products = await productService.getProductsWithFilters({ name, skip, take, sort, ...otherFilters });

        // Send the products as JSON response
        res.json(products);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error response
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};

// Controller function to handle fetching distinct values for a product
export const getProductDistinctValues = async (req: Request, res: Response) => {
    try {
        // Extract the productName from request parameters
        const { productName } = req.params;

        // Check if productName is provided, if not, send a 400 Bad Request response
        if (!productName) {
            return res.status(400).json({ error: 'Product name is required' });
        }

        // Call the ProductService to get distinct values for the product
        const distinctValues = await productService.getProductDistinctValues(productName);

        // Send the distinct values as JSON response
        res.json(distinctValues);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error response
        console.error('Error fetching distinct values:', error);
        res.status(500).send('Error fetching distinct values');
    }
};

// Controller function to handle fetching product quantities
export const getProductQuantities = async (req: Request, res: Response) => {
    try {
        // Call the ProductService to get product quantities
        const productQuantities = await productService.getProductQuantities();

        // Send the product quantities as JSON response
        res.json(productQuantities);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error response
        console.error('Error fetching product quantities:', error);
        res.status(500).send('Error fetching product quantities');
    }
};
