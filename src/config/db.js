import mongoose from 'mongoose'

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connected !!")
    })
    .catch((err)=>{
        console.log(err)
        process.exit(1)
    })
}