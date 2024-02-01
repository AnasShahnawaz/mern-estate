import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export async function verifyEmail(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ error: 'Invalid link' });
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) return res.status(400).json({ error: 'Invalid link' });
        await User.findByIdAndUpdate(user._id, { verified: true });
        await Token.findByIdAndDelete(token._id);
        res.status(200).json({ message: 'Email verified successfully' });
        console.log("Email verified successfully");
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function passwordLink(req, res) {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.json({ error: 'User with given email does not exist' });
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();
        }
        const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password Reset", url);
        res.status(200).json({ message: 'password reset link is sent to your email account' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(err);
    }
}

export async function verifyUrl(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.json({ error: 'Invalid link!' });
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) return res.json({ error: 'Invalid link!' });
        res.status(200).json('Your password is successfully reset');
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
}

export async function resetPassword(req, res) {
    const { password } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.json({ error: "Invalid link!" });
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) return res.json({ error: 'Invalid link!' });
        if (!user.verified) user.verified = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await Token.findByIdAndDelete(token._id);
        res.status(200).json("Password is changed successfully");
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
        console.log(error);
    }
}

export async function updateUser(req, res) {
    if (req.user.id !== req.params.id) return res.status(401).json({ error: "You can only update your own account!" });
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });
        await updatedUser.save();
        const { password: pass, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
    }
}

export async function deleteUser(req, res, next) {
    if (req.user.id !== req.params.id) return res.status(401).json({ error: "You can only delete your own account!" });
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted!").clearCookie('token');
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
    }
}

export async function getUserListings(req, res, next) {
    if (req.user.id !== req.params.id) return res.status(401).json({ error: "You can only get your own listing!" });
    try {
        const listings = await Listing.find({ userId: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
}

export async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ error: "User not found!" });

        const { password: pass, ...rest } = user._doc;

        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};