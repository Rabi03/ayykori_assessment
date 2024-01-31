import mongoose from "mongoose";

export interface PaymentDto{
    order_id:string;
    amount:number;
    session:mongoose.mongo.ClientSession
}