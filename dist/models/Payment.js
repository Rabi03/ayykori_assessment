"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    order_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: Number,
    paid_at: {
        type: Date,
        default: new Date()
    }
});
exports.default = mongoose_1.default.model('Payment', paymentSchema);
//# sourceMappingURL=Payment.js.map