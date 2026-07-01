import mongoose from 'mongoose'
import { ledgerModel } from './ledger.models.js'

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

accountSchema.methods.getBalance = async function(){
    const balaceData = await ledgerModel.aggregate([
        { $match:{account: this._id} },
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            { $eq:["$type","DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            { $eq:["$type","CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },{
            $project:{
                _id:0,
                balance:{
                    $subtract:["$totalCredit","$totalDebit"]
                }
            }
        }
    ])

    if(!balaceData || balaceData.length === 0){
        return 0
    }

    return balaceData[0].balance
}

export const accountModel = mongoose.model("account",accountSchema) 