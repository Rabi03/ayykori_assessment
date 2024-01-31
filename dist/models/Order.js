"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    customer_id: String,
    order_date: Date,
    status: String,
    items: [
        {
            product_id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: Number,
            price: Number
        }
    ]
});
exports.default = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map