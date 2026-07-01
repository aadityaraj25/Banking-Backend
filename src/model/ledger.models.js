import mongoose from 'mongoose'

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Ledger entry must be associated with an account"],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true, "Ledger entry must have an amount"],
        immutable:true,
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true, "Ledger entry must be associated with a transaction"],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Ledger entry type can be either CREDIT or DEBIT",
        },
        required:[true, "Ledger entry must have a type"],
        immutable:true,
    }
},{
    timestamps:true,
})

function preventLedgerModification() {
    throw new Error("ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

export const ledgerModel = mongoose.model("ledger",ledgerSchema)
