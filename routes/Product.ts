import express from 'express';
import { newProduct,allProduct } from '../controllers/ProductControllers';

const router=express.Router();


router.route('/product/new').post(newProduct)
router.route('/product/all').get(allProduct)

export default router;