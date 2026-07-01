import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:[true,"account must be asspciated with a user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"status can be either ACTIVE, FROZEN or CLOSED",
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"currency is required for creating an account"],
        default:"INR"
    },
},{
    timestamps:true,
})

// compound index
accountSchema.index({user:1,status:1})

export const accountModel = mongoose.model("account",accountSchema)