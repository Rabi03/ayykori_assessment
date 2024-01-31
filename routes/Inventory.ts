import express from 'express';
import { inventoryInfo,updateInventory } from '../controllers/InventoryControllers';

const router=express.Router();


router.route('/inventory/:productId').put(updateInventory)
router.route('/inventory/info').get(inventoryInfo )

export default router;