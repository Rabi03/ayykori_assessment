import { NextFunction, Request, Response } from "express";

export const isUserAuthenticated = async(req:Request,res:Response,next:NextFunction)=> {
    
    const apiKey = req.headers.authorization;
    

    if(!apiKey){
        return res.status(400).send('Login first to access this resource')
    }

    next()
}