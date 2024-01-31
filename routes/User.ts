import express from 'express';
import { newUser,userInfo } from '../controllers/UserControllers';

const router=express.Router();


router.route('/user/new').post(newUser)
router.route('/user/me').get(userInfo)

export default router;