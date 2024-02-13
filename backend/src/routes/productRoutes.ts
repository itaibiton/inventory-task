import express from 'express';
import { getProductDistinctValues, getProductQuantities, getProductsWithFilters } from '../controllers/productController';

const router = express.Router();

router.get('/products', getProductsWithFilters);
router.get('/products/distinct-values/:productName', getProductDistinctValues);
router.get('/products/quantities', getProductQuantities);

export default router;
