const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("database connected");
    }catch(e){
        console.log("error connecting database: ",e.message);
    }
}

module.exports = connectDB;