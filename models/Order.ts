import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    order_date: {
        type:Date,
        default:Date.now()
    },
    shipped: {
        type:Boolean,
        default:false
    },
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