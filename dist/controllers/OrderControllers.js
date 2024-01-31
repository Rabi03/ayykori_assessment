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
exports.shippingProcess = exports.paymentProcess = exports.allOrder = exports.newOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const User_1 = __importDefault(require("../models/User"));
const newOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderDetails = req.body;
    const products = orderDetails.items;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const order = new Order_1.default(Object.assign({ customer_id: req.headers.authorization }, orderDetails));
        yield order.save({ session });
        //Update Inventory for each product in the order
        let totalPrice = yield updateInventory(products, session);
        //Payment Processing
        yield (0, exports.paymentProcess)(req.headers.authorization, totalPrice, session, res);
    }
    catch (error) {
        // Rollback the transaction on error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error placing order:", error);
        res.status(500).json({
            error: error.errors ? error.errors : error.message
        });
    }
});
exports.newOrder = newOrder;
const allOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(404).send("No Order found");
    }
});
exports.allOrder = allOrder;
const updateInventory = (products, session) => __awaiter(void 0, void 0, void 0, function* () {
    let totalPrice = 0;
    for (const product of products) {
        const product_id = product.product_id;
        const quantityOrdered = product.quantity;
        totalPrice += product.price * quantityOrdered;
        // Find the product in inventory
        const inventoryProduct = yield Inventory_1.default.findOne({ product_id }).session(session);
        if (!inventoryProduct) {
            throw new Error(`Product with ID ${product_id} not found in inventory.`);
        }
        // Check if there is enough quantity available
        if (inventoryProduct.quantity_available < quantityOrdered) {
            throw new Error(`Insufficient quantity available for product with ID ${product_id}.`);
        }
        // Update inventory quantity
        inventoryProduct.quantity_available -= quantityOrdered;
        inventoryProduct.last_updated = new Date();
        yield inventoryProduct.save({ session });
    }
    return totalPrice;
});
const paymentProcess = (user_id, amount, session, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromUser = yield User_1.default.findById(user_id);
        if (!fromUser) {
            throw new Error("User not found with API Key " + user_id);
        }
        if (fromUser.balance < amount) {
            throw new Error(`Insufficient balance available for user with API key ${fromUser._id}.`);
        }
        fromUser.balance -= amount;
        yield fromUser.save({ session });
        const toUser = yield User_1.default.findOne({ isAdmin: true });
        if (!toUser) {
            throw new Error("Admin not found");
        }
        toUser.balance += amount;
        yield toUser.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).send("Order placed successfully.");
    }
    catch (error) {
        // Rollback the transaction on error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error placing order:", error);
        res.status(500).json({
            error: error.errors ? error.errors : error.message
        });
    }
});
exports.paymentProcess = paymentProcess;
const shippingProcess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order_id = req.body.order_id;
    try {
        const order = yield Order_1.default.findById(order_id);
        if (!order) {
            throw new Error(`Order with ID ${order_id} not found.`);
        }
        order.shipped = true;
        yield order.save();
        res.status(200).send("Order shipped successfully.");
    }
    catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            error: error.errors ? error.errors : error.message
        });
    }
});
exports.shippingProcess = shippingProcess;
//# sourceMappingURL=OrderControllers.js.map