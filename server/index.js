import express from "express";
import ConnectDataBase from "./config/ConnectDataBase.js";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'
import manageError from "./middlewares/ManageError.js";
dotenv.config();
const app = express();
app.use(express.json());
ConnectDataBase()

app.get('/', (req, res, next) => {
 res.send("YOO RUNNING WORLD")
});
app.use('/auth',authRoutes)

app.all("*",(req,res)=>{
  res.status(400).json({message:'cannot access the endpoint'})
})
app.use(manageError)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
