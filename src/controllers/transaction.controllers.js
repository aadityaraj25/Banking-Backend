import { accountModel } from "../model/account.models.js";
import { ledgerModel } from "../model/ledger.models.js"
import mongoose from "mongoose";
import { transactionModel } from '../model/transaction.models.js'
import { sendTransactionEmail } from "../services/email.service.js";

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

export const createTransaction = async(req,res) => {

    // validate request body
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            status:"error",
            message:"fromAccount, toAccount, amount and idempotencyKey are required fields"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            status:"error",
            message:"invalid fromAccount or toAccount"
        })
    }

    // validate idempotency key

    const isTransactionExist = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionExist){
        if(isTransactionExist.status === "COMPLETED"){
            return res.status(200).json({  
                message:"Transaction already completed",
                transaction:isTransactionExist
            })
        }

        if(isTransactionExist.status === "PENDING"){
            return res.status(200).json({  
                message:"Transaction is pending",
                transaction:isTransactionExist
            })
        }

        if(isTransactionExist.status === "FAILED"){
            return res.status(200).json({  
                message:"Transaction failed, please try again",
                transaction:isTransactionExist
            })
        }

        if(isTransactionExist.status === "REVERSED"){
            return res.status(200).json({  
                message:"Transaction reversed",
                transaction:isTransactionExist
            })
        }
    }


    // check amount status
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            status:"error",
            message:"both fromAccount and toAccount must be active to perform transaction"
        })
    }

    // Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance()
    if(balance < amount){
        return res.status(400).json({
            status:"error",
            message:`Insufficient funds. Your current balance is ${balance} and requested amount is ${amount}`
        })
    }

    // 5. Create transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }], {session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        transaction:transaction._id, 
        type:"CREDIT",
        amount:amount
    }], {session})  

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromAccount,
        transaction:transaction._id,
        type:"DEBIT",
        amount:amount
    }], {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    // userEmail, name, amount, transactionDetails
    await sendTransactionEmail(fromUserAccount.email, fromUserAccount.name, amount, {
        fromAccount:fromAccount,
        toAccount:toAccount,
        amount:amount,
        status:"COMPLETED"
    })

    res.status(200).json({
        status:"success",
        message:"Transaction completed successfully",
        transaction:transaction
    })

}

export const createInitialTransaction = async (req,res) => {
    const {toAccount, amount,idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            status:"error",
            message:"toAccount, amount and idempotencyKey are required fields"
        })
    }
    
    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!toUserAccount){
        return res.status(404).json({
            status:"error",
            message:"invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(404).json({
            status:"error",
            message:"system user account not found"
        })
    } 

    const session = await mongoose.startSession();
    session.startTransaction();
    
    const transaction = new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount:toAccount,
        amount:amount,
        idempotencyKey:idempotencyKey,
        status:"PENDING"
    })

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        transaction:transaction._id, 
        type:"CREDIT",
        amount:amount
    }], {session})
    
    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        transaction:transaction._id,
        type:"DEBIT",
        amount:amount
    }], {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
        status:"success",
        message:"Initial transaction completed successfully",
        transaction:transaction
    })
}