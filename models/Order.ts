import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    order_date: Date,
    status: String,
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: Number,
            price: Number
        }
    ]

})

export default mongoose.model('Order', orderSchema)