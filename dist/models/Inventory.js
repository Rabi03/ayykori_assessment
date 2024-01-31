"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const inventorySchema = new mongoose_1.default.Schema({
    product_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    quantity_available: {
        type: Number,
        required: true
    },
    last_updated: Date
});
exports.default = mongoose_1.default.model('Inventory', inventorySchema);
//# sourceMappingURL=Inventory.js.map