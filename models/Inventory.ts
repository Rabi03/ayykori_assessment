import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    quantity_available:{
        type:Number,
        required:true
    },
    last_updated: Date
})

export default mongoose.model('Inventory',inventorySchema);