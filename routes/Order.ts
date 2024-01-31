import express from 'express';
import { newOrder,allOrder } from '../controllers/OrderControllers';
import { isUserAuthenticated } from '../middleware/auth';

const router=express.Router();



router.route('/order/new').post(isUserAuthenticated,newOrder)
router.route('/order/all').get(allOrder)

export default router;