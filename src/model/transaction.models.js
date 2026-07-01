import mongoose from 'mongoose'

const transaction = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Transaction must be associated with a from account"],
        index:true,
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Transaction must be associated with a to account"],
        index:true,
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
        },
        default:"PENDING",
    },
    amount:{
        type:Number,
        required:[true, "Transaction must have an amount"],
        min:[0,"transaction amount cannot be negative"],
    },
    idempotencyKey:{
        type:String,
        required:[true, "Transaction must have an idempotency key"],
        index:true,
    },
},{
    timestamps:true,    
})

export const transactionModel = mongoose.model("transaction",transaction)


