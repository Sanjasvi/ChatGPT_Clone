import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());


app.use("/api", chatRoutes);


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

const connectDB =  async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    }catch(err){
        console.log("Error connecting to MongoDB:", err);
    }
}

