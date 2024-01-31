import express from 'express';
import { newUser,userInfo,updateBalance,createAnAdmin } from '../controllers/UserControllers';
import { isUserAuthenticated } from '../middleware/auth';

const router=express.Router();


router.route('/user/new').post(newUser)
router.route('/user/me').get(isUserAuthenticated,userInfo)
router.route('/user/balance').put(isUserAuthenticated,updateBalance)
router.route('/admin/create').post(createAnAdmin)

export default router;