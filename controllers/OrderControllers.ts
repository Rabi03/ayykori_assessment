import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Order from "../models/Order";
import { OrderDto, OrderItemDto } from "../interface/Order";
import Inventory from "../models/Inventory";
import { InventoryDto } from "../interface/Inventory";

export const newOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderDetails = req.body as OrderDto;
    const products: OrderItemDto[] = orderDetails.items;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = new Order({customer_id:req.headers.authorization,...orderDetails});
        await order.save({ session });

        // Step 2: Update Inventory for each product in the order
        for (const product of products) {
            const product_id = product.product_id;
            const quantityOrdered = product.quantity;

            // Find the product in inventory
            const inventoryProduct = await Inventory.findOne({ product_id }).session(session) as InventoryDto;

            if (!inventoryProduct) {
                throw new Error(`Product with ID ${product_id} not found in inventory.`);
            }

            // Check if there is enough quantity available
            if (inventoryProduct.quantity_available < quantityOrdered) {
                throw new Error(`Insufficient quantity available for product with ID ${product_id}.`);
            }

            // Update inventory quantity
            inventoryProduct.quantity_available -= quantityOrdered;
            await inventoryProduct.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).send("Order placed successfully.");


    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error("Error placing order:", error);
        res.status(500).send("Failed to place order.");
    }

}

export const allOrder=async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orders=await Order.find();

        res.status(200).json(orders)
        
    } catch (error) {
        res.status(404).send("No Order found")
    }
}