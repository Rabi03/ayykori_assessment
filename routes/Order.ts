import express from 'express';
import { newOrder,allOrder,shippingProcess } from '../controllers/OrderControllers';
import { isUserAuthenticated } from '../middleware/auth';

const router=express.Router();



router.route('/order/new').post(isUserAuthenticated,newOrder)
router.route('/order/all').get(isUserAuthenticated,allOrder)
router.route('/order/shipped').put(isUserAuthenticated,shippingProcess)

export default router;