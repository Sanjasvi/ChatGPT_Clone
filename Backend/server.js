import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
//
import path from "path";
import { fileURLToPath } from "url";



const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/api", chatRoutes);
//
app.use(express.static(path.join(__dirname, "../Frontend/dist")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

const connectDB =  async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    }catch(err){
        console.log("Error connecting to MongoDB:", err);
    }
}

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});





