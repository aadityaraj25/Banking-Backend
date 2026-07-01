import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import accountRouter from './routes/account.routes.js'
import transactionRouter from './routes/transaction.routes.js'
import { authMiddleware, authSystemUserMiddleware } from './middleware/auth.middleware.js';

const app = express();

app.use(express.json())
app.use(cookieParser())

// routes
app.use("/api/auth",authRouter)
app.use("/api/accounts",authMiddleware,accountRouter)
app.use("/api/transactions",authSystemUserMiddleware,transactionRouter)

export default app;