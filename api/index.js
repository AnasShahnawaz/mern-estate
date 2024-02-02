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
const PORT = "https://mern-estate-api-tau.vercel.app" || port;

const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

dbConnect();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
