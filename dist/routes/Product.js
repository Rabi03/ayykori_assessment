"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductControllers_1 = require("../controllers/ProductControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/product/new').post(auth_1.isUserAuthenticated, ProductControllers_1.newProduct);
router.route('/product/all').get(auth_1.isUserAuthenticated, ProductControllers_1.allProduct);
exports.default = router;
//# sourceMappingURL=Product.js.map