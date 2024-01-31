import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import User from '../models/User';


export const newUser=async (req:Request, res:Response,next:NextFunction) => {
    const userDetaiils=req.body;

    try {

        const user=await User.findOne({email:userDetaiils.email});

        if(user){
            throw new Error(`User already exists with email ${user.email}.`);
        }
        else{
            const newuser=new User(userDetaiils);

            await newuser.save();

            res.status(201).send(`Your api key : ${newuser._id}`);
        }
        
    } catch (error) {
        res.status(400).send("Can not create account."+error)
    }

}

export const userInfo=async (req:Request, res:Response,next:NextFunction) => {
    const email=req.body.email;
    try {
        const user=await User.findOne({email});
        if(!user){
            throw new Error(`Can not find user with email ${user.email}.`);
        }

        res.status(200).send(`Your api key : ${user._id}`);
        
    } catch (error) {
        res.status(404).send("Can not find user with email."+error)
    }
}