"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserControllers_1 = require("../controllers/UserControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/user/new').post(UserControllers_1.newUser);
router.route('/user/me').get(auth_1.isUserAuthenticated, UserControllers_1.userInfo);
router.route('/user/balance').put(auth_1.isUserAuthenticated, UserControllers_1.updateBalance);
router.route('/admin/create').post(UserControllers_1.createAnAdmin);
exports.default = router;
//# sourceMappingURL=User.js.map