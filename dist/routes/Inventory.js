"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InventoryControllers_1 = require("../controllers/InventoryControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/inventory/:productId').put(auth_1.isUserAuthenticated, InventoryControllers_1.updateInventory);
router.route('/inventory/info').get(auth_1.isUserAuthenticated, InventoryControllers_1.inventoryInfo);
exports.default = router;
//# sourceMappingURL=Inventory.js.map