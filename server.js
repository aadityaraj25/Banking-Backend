import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();
connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`server is listening on port : ${process.env.PORT}`)
})