const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = require("../config/emailconfig.js");

const userRegister = async (req, res) => {
    const { name, email, password, confirmPassword, tc } = req.body;
    if (!name || !email || !password || !confirmPassword || !tc) {
        return res.status(400).send({ "status": "failed", "message": "fill all fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
        res.status(400).send({ "status": "failed", "message": "email already exits" });
    }
    if (password != confirmPassword) {
        return res.status(400).send({ "status": "failed", "message": "passwords did not match" });
    }
    try {
        const user = new User({
            name,
            email,
            password,
            tc
        })
        await user.save();
        //console.log(user);
        const token = await user.generateToken();

        res.status(201).send({ "status": "success", "message": "registration successful", "token": token });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({ email: email });
            // console.log(user);
            if (!user) {
                // console.log("error2");
                res.status(400).send({ "status": "failed", "message": "wrong email or password" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // console.log("error3");
                res.status(400).send({ "status": "failed", "message": "wrong email or password" });
            }
            const token = await user.generateToken();
            res.status(200).send({ "status": "success", "message": "login successful", "token": token });

        } else {
            res.status(400).send({ "status": "failed", "message": "fill all fields" });
        }
    } catch (e) {
        // console.log(e);
        res.status(400).send({ "status": "failed", "message": e.message });
    }
}

const changeUserPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        return res.status(400).send({ "status": "failed", "message": "fill all fields" });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ "status": "failed", "message": "passwords are not matching" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } });
    res.status(200).send({ "status": "success", "message": "password changed successfully" });
}

const loggedUser = async (req, res)=>{
    res.send({"user": req.user});
}

const forgotPassword = async (req, res)=>{
    const { email } = req.body;
    if(!email){
        return res.status(400).send({"status":"failed", "message":"email is required"});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).send({"status":"failed", "message":"no record found"});
    }
    const secret = user._id + process.env.SECRET_KEY;
    const token = jwt.sign({id: user._id}, secret, {expiresIn: '5m'});
    const link = `http://localhost:127.0.0.1:3000/user/reset/${user._id}/${token}`;
    
    //console.log(link);
    //send email

    let info = transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "password reset link",
        html: `<a href="${link}">click here</a>to reset your password`
    })
    return res.status(400).send({"status":"success", "message":"link sent to email","info":info});
}

const resetPassword = async (req, res)=>{
    const {password, confirmPassword} = req.body;
    const {id, token} = req.params;
    const user = await User.findById(id);
    const newKey = user._id + process.env.SECRET_KEY;
    try{
        jwt.verify(token, newKey)
        if(!password || !confirmPassword){
            return res.status(400).send({"status":"failed","message": "fill all fields"});
        }
        if(password!== confirmPassword){
            return res.status(400).send({"status":"failed", "message":"passwords not matching"});
        }
        const hashPassword = await bcrypt.hash(password,10);
        await User.findByIdAndUpdate(user._id, {$set : {password: hashPassword}});
        return res.status(400).send({"status":"success", "message":"password changed successfully"});
    }catch(e){
        return res.status(400).send({"status":"failed", "message":"token expired"});
    }
}

module.exports = { userRegister, userLogin, changeUserPassword, loggedUser, forgotPassword, resetPassword};