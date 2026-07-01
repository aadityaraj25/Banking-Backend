import Router from "express";
import { createInitialTransaction, createTransaction } from "../controllers/transaction.controllers.js";

const route = Router();

route.post("/",createTransaction)
route.post("/system/initial-funds",createInitialTransaction)

export default route;