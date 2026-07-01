import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        trim: true,
        unique: [true,"Email already exists"],
        lowercase: true,
        match:[/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,"Invalid email address"]
    },
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    systemUser:{
        type: Boolean,
        default: false,
        immutable:true,
        select:false
    }
},{timestamps: true});

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return
})


userSchema.methods.comparePassword = async function(password){  
    return await bcrypt.compare(password, this.password);
}


export const userModel = mongoose.model("user",userSchema)