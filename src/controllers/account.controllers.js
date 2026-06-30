import { accoutModel } from "../model/account.models.js"; 

export const createAccountController = async (req,res) => {
    const user = req.user
    const account = await accoutModel.create({
        user:userId
    })
    return res.status(201).json({
        acocunt,
    })
}