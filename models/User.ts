import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        unique:true
    },
    balance:{
        type:Number,
        default:200000
    }
})

export default mongoose.model('User',userSchema);