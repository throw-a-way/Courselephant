const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const { userModel } = require("../db.js");
const {JWT_USER_PASSWORD} = require("../config");
const { userMiddleware } = require("../middlewares/user.js");


// ZOD Schemas for validation
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);


// User Signup Route
userRouter.post("/signup", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Validate email and password using ZOD
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!emailValidation.success || !passwordValidation.success) {
        return res.status(400).json({ message: "Invalid email or password format" });
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        await userModel.create({ 
            email, 
            password, 
            firstName, 
            lastName });
        res.status(201).json({ message: "User signup successful" });
    } catch (error) {
        console.error("Signup failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// User Signin Route
userRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password using ZOD
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!emailValidation.success || !passwordValidation.success) {
        return res.status(400).json({ message: "Invalid email or password format" });
    }

    try {
        // Find user by email and password
        const user = await userModel.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: "1h" });

        // Return token and success message
        res.json({ token, message: "Successfully logged in" });
    } catch (error) {
        console.error("Signin failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/mypurchases",userMiddleware, (req,res)=>{
    res.json({
        message: "List all mypurchases endpoint"
    })
})

module.exports = userRouter;