const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbconn.js");
const userRoutes = require("./routes/userRoutes.js");


dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

const port = process.env.port;
app.listen(port, ()=>{
    console.log(`server running at port ${port}`);
})