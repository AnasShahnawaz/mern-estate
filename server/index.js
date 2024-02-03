import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import { dbConnect } from "./database/dbConnect.js";
import { port } from "./config/index.js";

const app = express();

const PORT = port || 3000; 

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
}));
app.use(cookieParser());

dbConnect();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.get('*', (req, res) => {
    res.send("Server is running...");
});

app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
