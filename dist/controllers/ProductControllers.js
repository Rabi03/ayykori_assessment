"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProduct = exports.newProduct = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const newProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productDetails = req.body;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const product = new Product_1.default({ name: productDetails.name, price: productDetails.price });
        yield product.save({ session });
        const inventory = new Inventory_1.default({ product_id: product._id, quantity_available: productDetails.quantity_available, last_updated: new Date() });
        yield inventory.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).send("Product Added successfully.");
    }
    catch (error) {
        // Rollback the transaction on error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error adding product:", error);
        res.status(500).json({
            error: error.errors,
            message: "Failed to add product."
        });
    }
});
exports.newProduct = newProduct;
const allProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(404).send("No Product found");
    }
});
exports.allProduct = allProduct;
//# sourceMappingURL=ProductControllers.js.map