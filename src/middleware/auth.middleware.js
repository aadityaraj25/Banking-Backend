import jwt from 'jsonwebtoken'
import { userModel } from '../model/user.models.js'

export const authMiddleware = (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = userModel.findById(decoded.userId)

        if(!user){
            return res.json({
                message:"Unable to find user"
            })
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

