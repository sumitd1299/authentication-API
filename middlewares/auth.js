const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const auth = async function(req, res, next){
    let token
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            // get token from header
            token = authorization.split(" ")[1];
            // verify token
            const { id } = jwt.verify(token, process.env.SECRET_KEY);

            req.user = await User.findById(id).select("-password");
            next();
        }catch(e){
            console.log(e);
            res.status(400).send({"status":"failed","message":"unauthorized user"})
        }
    }
}

module.exports = auth;