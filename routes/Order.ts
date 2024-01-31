import express from 'express';
import { newOrder,allOrder,shippingProcess } from '../controllers/OrderControllers';

const router=express.Router();



router.route('/order/new').post(newOrder)
router.route('/order/all').get(allOrder)
router.route('/order/shipped').put(shippingProcess)

export default router;