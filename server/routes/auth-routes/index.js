import express from 'express';
import { loginUser, registerUser } from "../../controllers/auth-controller/index.js";
import authenticate from '../../middleware/auth-middleware.js';

const authRouter = express.Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.get("/check-auth", authenticate, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "User is authenticated",
        data: {
            user,
        }
    });
});

export default authRouter;
