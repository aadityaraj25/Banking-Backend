import { accountModel } from "../model/account.models.js"; 

export const createAccountController = async (req,res) => {
    const user = req.user
    const account = await accountModel.create({
        user,
    })
    return res.status(201).json({
        account,
    })
}