import { config } from "dotenv";
config();

export const port = process.env.PORT || 3000;
export const jwt_secret_key = process.env.JWT_SECRET_KEY;
export const mongodb_url = process.env.MONGODB_URL;
