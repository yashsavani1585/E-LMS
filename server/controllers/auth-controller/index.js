import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register User
export const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ userEmail: userEmail }, { userName: userName }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userName,
            userEmail,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        // Find user by email
        const user = await User.findOne({ userEmail: userEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials!",
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                _id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                role: user.role,
            },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "2h" }
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                accessToken,
                user: {
                    _id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};