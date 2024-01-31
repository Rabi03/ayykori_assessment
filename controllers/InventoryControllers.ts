import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Inventory from "../models/Inventory";
import { InventoryDto } from "../interface/Inventory";


export const updateInventory=async (req:Request, res:Response,next:NextFunction) => {
    const productId = req.params.productId;
    const quantityToUpdate = req.body.quantity;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Step 1: Find the product in inventory
        const product = await Inventory.findOne({ product_id:productId }).session(session) as InventoryDto;

        if (!product) {
            throw new Error("Product not found in inventory.");
        }

        // Step 2: Update inventory quantity
        product.quantity_available += quantityToUpdate;
        await product.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).send("Inventory updated successfully.");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating inventory:", error);
        res.status(500).send("Failed to update inventory.");
    }
}

export const inventoryInfo=async (req:Request, res:Response,next:NextFunction) => {
    
    try {

        const info=await Inventory.find();
        res.status(200).json(info)
        
    } catch (error) {
        res.status(404).send("No item found.")
    }
}