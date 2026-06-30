import express from 'express'
import { createAccountController } from '../controllers/account.controllers.js';

const router = express.Router();

router.post("/",createAccountController)

export default router