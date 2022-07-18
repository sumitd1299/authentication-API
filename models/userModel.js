const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type:String, 
        required: true, 
        trim: true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        unique: [true, "email already exists"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        }
    },                
    password: {
        type:String, 
        required: true,
        minLength: 6, 
        trim: true
    },
    tc: {
        type:Boolean, 
        required: true
    }
});

userSchema.methods.generateToken = async function(){
    try{
        const token = jwt.sign({id:this._id}, process.env.SECRET_KEY, {expiresIn: "1d"});
        return token;
    }catch(e){
        return ;
    }
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = new mongoose.model("User", userSchema);

module.exports = User;