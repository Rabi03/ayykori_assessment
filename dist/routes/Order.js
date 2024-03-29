"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderControllers_1 = require("../controllers/OrderControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/order/new').post(auth_1.isUserAuthenticated, OrderControllers_1.newOrder);
router.route('/order/all').get(auth_1.isUserAuthenticated, OrderControllers_1.allOrder);
router.route('/order/shipped').put(auth_1.isUserAuthenticated, OrderControllers_1.shippingProcess);
exports.default = router;
//# sourceMappingURL=Order.js.map