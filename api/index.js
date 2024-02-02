import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import { dbConnect } from "./database/dbConnect.js";
import { port } from "./config/index.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["https://mern-estate-one.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use(cookieParser());

dbConnect();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.get('*', (req, res) => {
    res.send("Server is running...");
});

app.listen(port, console.log(`Server is running on port: {port}`));
