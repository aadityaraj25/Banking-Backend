import jwt from 'jsonwebtoken'
import { userModel } from '../model/user.models.js'

export const authMiddleware = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user
        return next();
    }
    catch(error){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }
}

export const authSystemUserMiddleware = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }
    
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, user is not a system user"
            });
        }

        req.user = user
        return next();
    }
    catch(error){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }   
}
