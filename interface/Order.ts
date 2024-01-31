import { ObjectId } from "mongoose";

export interface OrderDto{
    items: OrderItemDto[]
}

export interface OrderItemDto{
    product_id:ObjectId;
    quantity: number;
    price: number
}