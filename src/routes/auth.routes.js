import express, { Router } from 'express'
import { userLogin, userRegister } from '../controllers/auth.controllers.js'

const router = Router()

router.post("/register",userRegister)
router.post("/login",userLogin)

export default router