import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from 'dotenv';
import { jwt_secret_key } from "../config/index.js";
import { sendEmail } from "../utils/sendEmail.js";
dotenv.config();


export async function signup(req, res, next) {
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) return res.json({ error: 'User is already exist!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    try {
        const user = await newUser.save();
        const newToken = new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        });
        const token = await newToken.save();
        const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "User created successfully", url);
        res.status(200).json({ message: 'An Email sent to your account please verify.' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error!' });
        console.log(err);
    }
}

export async function signin(req, res, next) {
    try {
        const { email, password } = req.body;

        const validUser = await User.findOne({ email });
        if (!validUser) return res.json({ error: 'User not found!' });
        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) return res.json({ error: 'Password is wrong!' });
        if (!validUser.verified) {
            let token = await Token.findOne({ userId: validUser._id });
            if (!token) {
                token = await new Token({
                    userId: validUser._id,
                    token: crypto.randomBytes(32).toString('hex')
                });
                await token.save();
                const url = `${process.env.BASE_URL}/users/${validUser._id}/verify/${token.token}`;
                await sendEmail(validUser.email, 'Verify Email', url);
            }
            return res.json({ message: 'Email not verified, please go to your gmail to verify!' });
        }
        const token = await jwt.sign({ id: validUser._id }, jwt_secret_key, { expiresIn: '2d' });
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
    } catch (err) {
        res.status(500).json({ error: 'Invalid server error' });
        console.log(err);
    }
}

export async function google(req, res) {
    const { name, email, photo } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id }, jwt_secret_key, { expiresIn: '2d' });
            const { password: pass, ...rest } = user._doc;
            res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name,
                email: email,
                password: hashedPassword,
                avatar: photo,
                verified: true,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, jwt_secret_key, { expiresIn: '2d' });
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
        console.log(error);
    }
};

export async function signout(req, res, next) {
    try {
        res.clearCookie('token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
        console.log(error);
    }
}
