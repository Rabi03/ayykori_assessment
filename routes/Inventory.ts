import express from 'express';
import { inventoryInfo,updateInventory } from '../controllers/InventoryControllers';
import { isUserAuthenticated } from '../middleware/auth';

const router=express.Router();


router.route('/inventory/:productId').put(isUserAuthenticated,updateInventory)
router.route('/inventory/info').get(isUserAuthenticated,inventoryInfo )

export default router;