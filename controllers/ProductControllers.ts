import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from '../models/Product';
import Inventory from "../models/Inventory";
import { InventoryDto } from "../interface/Inventory";
import { ProductDto } from "../interface/Product";

export const newProduct=async(req:Request,res:Response,next:NextFunction)=>{
    const productDetails=req.body as ProductDto;

    const session=await mongoose.startSession();

    session.startTransaction();

    try {

        const product=new Product({name:productDetails.name,price:productDetails.price});

        await product.save({ session });

        const inventory=new Inventory({product_id:product._id,quantity_available:productDetails.quantity_available,last_updated:Date.now()});

        await inventory.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(200).send("Product Added successfully.");


        
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error("Error adding product:", error);
        res.status(500).send("Failed to add product.");
    }
}

export const allProduct=async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const products=await Product.find();

        res.status(200).json(products)
        
    } catch (error) {
        res.status(404).send("No Product found")
    }
}