import express from "express";
import {
    deleteUser,
    getUser,
    getUserListings,
    passwordLink,
    resetPassword,
    updateUser,
    verifyEmail,
    verifyUrl
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/:id/verify/:token', verifyEmail);
router.post('/reset/password', passwordLink);
router.post('/:id/:token', verifyUrl);
router.post('/reset/password/:id/:token', resetPassword);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/get/:id', getUser)

export default router;