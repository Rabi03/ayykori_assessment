import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Order"
    },
    from:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount:Number,
    paid_at:{
        type:Date,
        default:new Date()
    }
})

export default mongoose.model('Payment', paymentSchema)