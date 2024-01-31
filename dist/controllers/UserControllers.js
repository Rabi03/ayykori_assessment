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
exports.createAnAdmin = exports.updateBalance = exports.userInfo = exports.newUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const newUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetaiils = req.body;
    try {
        const user = yield User_1.default.findOne({ email: userDetaiils.email });
        if (user) {
            throw new Error(`User already exists with email ${user.email}.`);
        }
        else {
            const newuser = new User_1.default(userDetaiils);
            yield newuser.save();
            res.status(201).send(`Your api key : ${newuser._id}`);
        }
    }
    catch (error) {
        res.status(400).send("Can not create account." + error.message);
    }
});
exports.newUser = newUser;
const userInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.headers.authorization);
        if (!user) {
            throw new Error(`Can not find user with API key ${req.headers.authorization}.`);
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(404).send("Can not find user with API key." + error.message);
    }
});
exports.userInfo = userInfo;
const updateBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.headers.authorization);
        if (!user) {
            throw new Error(`Can not find user with email ${user.email}.`);
        }
        user.balance += 10000;
        res.status(200).send("Balance updated");
    }
    catch (error) {
        res.status(404).send("Can not find user with email." + error.message);
    }
});
exports.updateBalance = updateBalance;
const createAnAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetaiils = req.body;
    try {
        const user = yield User_1.default.findOne({ isAdmin: true });
        if (user) {
            throw new Error(`System has an admin already`);
        }
        else {
            const newuser = new User_1.default(Object.assign(Object.assign({}, userDetaiils), { isAdmin: true }));
            yield newuser.save();
            res.status(201).send(`Your api key : ${newuser._id}`);
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
exports.createAnAdmin = createAnAdmin;
//# sourceMappingURL=UserControllers.js.map