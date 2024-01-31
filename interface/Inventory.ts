import mongoose, { ObjectId } from "mongoose";

export interface InventoryDto{
    _id:any;
    product_id: any;
    quantity_available: number;
    last_updated: Date;
    save:(data: any)=>void
}