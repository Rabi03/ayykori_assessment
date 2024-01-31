import express from 'express';
import { newUser,userInfo,updateBalance,createAnAdmin } from '../controllers/UserControllers';

const router=express.Router();


router.route('/user/new').post(newUser)
router.route('/user/me').get(userInfo)
router.route('/user/balance').put(updateBalance)
router.route('/admin/create').put(createAnAdmin)

export default router;