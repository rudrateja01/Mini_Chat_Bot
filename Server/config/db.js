import mongoose from "mongoose";
import { Admin } from "../controllers/authController.js";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Database Connected");
    Admin();
})
.catch((error)=>{console.log(error.message)});