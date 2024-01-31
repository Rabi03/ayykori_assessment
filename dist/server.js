"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
process.on('uncaughtException', err => {
    console.log(err.stack);
    console.log('Server is sutting down due to uncaught exception');
    process.exit(1);
});
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
mongoose_1.default.connect(process.env.MONGODB).then((con) => console.log(`Mongodb connectd with host: ${con.connection.host}`));
const server = app.listen(process.env.PORT || 5000, () => console.log(`Server is running on Port: 5000`));
process.on('unhandledRejection', err => {
    console.log(err);
    console.log('Server is sutting down due to unhandled rejection');
    server.close(() => process.exit(1));
});
//# sourceMappingURL=server.js.map