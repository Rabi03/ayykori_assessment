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
        res.status(400).send("Can not create account."+error.message)
    }

}

export const userInfo=async (req:Request, res:Response,next:NextFunction) => {
    try {
        const user=await User.findById(req.headers.authorization);
        if(!user){
            throw new Error(`Can not find user with API key ${req.headers.authorization}.`);
        }

        res.status(200).json({user});
        
    } catch (error) {
        res.status(404).send("Can not find user with API key."+error.message)
    }
}

export const updateBalance=async (req:Request, res:Response,next:NextFunction) => {
    try {
        const user=await User.findById(req.headers.authorization);
        if(!user){
            throw new Error(`Can not find user with email ${user.email}.`);
        }

        user.balance+=10000;

        res.status(200).send("Balance updated");
        
    } catch (error) {
        res.status(404).send("Can not find user with email."+error.message)
    }
}

export const createAnAdmin=async (req:Request, res:Response,next:NextFunction) => {
    const userDetaiils=req.body;
    try {
        const user=await User.findOne({isAdmin:true});
        if(user){
            throw new Error(`System has an admin already`);
        }
        else{
            const newuser=new User({...userDetaiils,isAdmin:true});

            await newuser.save();

            res.status(201).send(`Your api key : ${newuser._id}`);
        }

        
        
    } catch (error) {
        res.status(400).send(error.message)
    }
}