"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true
    },
    balance: {
        type: Number,
        default: 200000
    }
});
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map