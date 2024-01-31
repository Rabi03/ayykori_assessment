"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { newOrder, getSingleOrder, myOrders } = require('../controllers/OrderControllers');
router.route('/order/new').post(newOrder);
router.route('/order/:id').get(getSingleOrder);
router.route('/orders/me').get(myOrders);
exports.default = router;
//# sourceMappingURL=Order.js.map