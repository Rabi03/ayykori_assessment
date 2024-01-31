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
exports.inventoryInfo = exports.updateInventory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const updateInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const quantityToUpdate = req.body.quantity;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Step 1: Find the product in inventory
        const product = yield Inventory_1.default.findOne({ product_id: productId }).session(session);
        if (!product) {
            throw new Error("Product not found in inventory.");
        }
        // Step 2: Update inventory quantity
        product.quantity_available += quantityToUpdate;
        product.last_updated = new Date();
        yield product.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).send("Inventory updated successfully.");
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Error updating inventory:", error);
        res.status(500).json({
            error: error.errors ? error.errors : error.message,
            message: "Failed to update inventory"
        });
    }
});
exports.updateInventory = updateInventory;
const inventoryInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield Inventory_1.default.find();
        res.status(200).json(info);
    }
    catch (error) {
        res.status(404).send("No item found.");
    }
});
exports.inventoryInfo = inventoryInfo;
//# sourceMappingURL=InventoryControllers.js.map