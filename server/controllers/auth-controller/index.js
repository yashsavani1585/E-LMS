import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Register User
const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ userEmail: userEmail }, { userName: userName }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!',
            });
        }

        // Hash password before saving
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userName,
            userEmail,
            password: hashPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        // Find user by email
        const checkUser = await User.findOne({ userEmail: userEmail });

        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials!',
            });
        }

        const accessToken = jwt.sign(
          {
              _id: checkUser._id,
              userName: checkUser.userName,
              userEmail: checkUser.userEmail,
              role: checkUser.role,
          },
          process.env.JWT_SECRET || "default_secret", // Fallback to a default secret
          { expiresIn: "2h" }
      );
      

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    userName: checkUser.userName,
                    userEmail: checkUser.userEmail,
                    role: checkUser.role,
                },
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export { registerUser, loginUser };
