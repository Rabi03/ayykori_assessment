import express from 'express';
import { newProduct,allProduct } from '../controllers/ProductControllers';
import { isUserAuthenticated } from '../middleware/auth';

const router=express.Router();


router.route('/product/new').post(isUserAuthenticated,newProduct)
router.route('/product/all').get(allProduct)

export default router;