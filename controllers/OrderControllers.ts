import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Order from "../models/Order";
import { OrderDto, OrderItemDto } from "../interface/Order";
import Inventory from "../models/Inventory";
import { InventoryDto } from "../interface/Inventory";
import { PaymentDto } from "../interface/Payment";
import User from "../models/User";



export const newOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderDetails = req.body as OrderDto;
    const products: OrderItemDto[] = orderDetails.items;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = new Order({customer_id:req.headers.authorization,...orderDetails});
        await order.save({ session });
        //Update Inventory for each product in the order
        let totalPrice=await updateInventory(products,session);
        //Payment Processing

        await paymentProcess(req.headers.authorization,totalPrice,session,res);


    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error("Error placing order:", error);
        res.status(500).json({
            error:error.errors?error.errors: error.message
        });
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


const updateInventory=async(products:OrderItemDto[],session:mongoose.mongo.ClientSession)=>{
    let totalPrice=0
    for (const product of products) {
        const product_id = product.product_id;
        const quantityOrdered = product.quantity;
        totalPrice+=product.price*quantityOrdered;

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
        inventoryProduct.last_updated=new Date();
        await inventoryProduct.save({ session });
    }

    return totalPrice
}

export const paymentProcess=async (user_id:string,amount:number,session:mongoose.mongo.ClientSession,res:Response) => {
    
    
    try {

        const fromUser=await User.findById(user_id);
        if(!fromUser){
            throw new Error("User not found with API Key "+user_id);
        }

        if(fromUser.balance<amount){
            throw new Error(`Insufficient balance available for user with API key ${fromUser._id}.`);
        }

        fromUser.balance-=amount;

        await fromUser.save({session});

        const toUser=await User.findOne({isAdmin:true});

        if(!toUser){
            throw new Error("Admin not found");
        }

        toUser.balance+=amount;

        await toUser.save({session});

        

        await session.commitTransaction();
        session.endSession();

        res.status(200).send("Order placed successfully.");
        
    } catch (error) {

         // Rollback the transaction on error
         await session.abortTransaction();
         session.endSession();
         console.error("Error placing order:", error);
         res.status(500).json({
             error:error.errors?error.errors: error.message
         });
        
    }


}

export const shippingProcess=async (req: Request, res: Response, next: NextFunction) => {
    const order_id=req.body.order_id;

    try {

        const order=await Order.findById(order_id);

        if(!order){
            throw new Error(`Order with ID ${order_id} not found.`)
        }

        order.shipped=true;

        await order.save();

        res.status(200).send("Order shipped successfully.");

        
    } catch (error) {
        console.error("Error placing order:", error);
         res.status(500).json({
             error:error.errors?error.errors: error.message
         });
    }
}
