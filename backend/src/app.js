import dotenv from "dotenv"
dotenv.config();
import express from "express"
import connectDB from "../config/connectDB.js";
import router from "../routes/user.routes.js";
import paymentRouter from "../routes/payment.routes.js";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())

app.use("/",router)
app.use("/",paymentRouter)

const startServer = async () =>{
    try{
    await connectDB();
app.listen(PORT,() =>{
    console.log("Connected to Port",PORT);
})
}
catch(err){
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();