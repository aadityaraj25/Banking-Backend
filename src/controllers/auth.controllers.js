import express from 'express'
import jwt from 'jsonwebtoken'
import { userModel } from '../model/user.models.js'
import { sendRegisterEmail } from '../services/email.service.js';

export const userRegister = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        
        const isExists = await userModel.findOne({
            email,
        })
        if(isExists){
            return res.status(422).json({
                message: "User already exists with email.",
                status:"failed"
            })
        }

        const user = await userModel.create({
            email,
            password,
            name,
        })

        const token = jwt.sign(
            {
                userId:user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"3d",
            }
        )

        res.cookie("token",token)
        sendRegisterEmail(user.email,user.name)
        res.status(201).json({user:user,token:token,message:"User Created Successfully"})


    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const userLogin = async(req,res) => {
    try {
        const {email,password} = req.body;
        
        const user = await userModel.findOne({
            email,
        }).select("+password")
        if(!user){
            return res.status(401).json({message:"Email is not registered"})
        }

        const isValid = await user.comparePassword(password)
        if(!isValid){
            return res.status(401).json({
                message:"Password is incorrect",
            })
        }
        const token = jwt.sign(
            {
                userId:user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"3d",
            }
        )

        res.cookie("token",token)
        res.status(201).json({user:user,token:token,message:"User LoggedIn Successfully"})


    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}