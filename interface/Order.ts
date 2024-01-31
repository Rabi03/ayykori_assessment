import { ObjectId } from "mongoose";

export interface OrderDto{
    order_date: Date;
    status: String;
    items: OrderItemDto[]
}

export interface OrderItemDto{
    product_id:ObjectId;
    quantity: number;
    price: number
}