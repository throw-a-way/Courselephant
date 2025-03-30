const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const { adminModel, courseModel } = require("../db.js");
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middlewares/admin.js");


// ZOD Schemas for validation
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);


// Admin Signup Route
    adminRouter.post("/signup", async (req, res) => {
        const { email, password, firstName, lastName } = req.body;

        // Validate email and password using ZOD
        const emailValidation = emailSchema.safeParse(email);
        const passwordValidation = passwordSchema.safeParse(password);

        if (!emailValidation.success || !passwordValidation.success) {
            return res.status(400).json({ message: "Invalid email or password format" });
        }

        try {
            // Check if admin already exists
            const existingAdmin = await adminModel.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: "Admin already exists" });
            }

            // Create new admin
            await adminModel.create({ 
                email, 
                password, 
                firstName, 
                lastName });
            res.status(201).json({ message: "Admin signup successful" });
        } catch (error) {
            console.error("Signup failed:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

// Admin Signin Route
    adminRouter.post("/signin", async (req, res) => {
        const { email, password } = req.body;
    
        // Validate email and password using ZOD
        const emailValidation = emailSchema.safeParse(email);
        const passwordValidation = passwordSchema.safeParse(password);
    
        if (!emailValidation.success || !passwordValidation.success) {
            return res.status(400).json({ message: "Invalid email or password format" });
        }
    
        try {
            // Find admin by email and password
            const admin = await adminModel.findOne({ email, password });
    
            if (!admin) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
    
            // Generate JWT token
            const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD, { expiresIn: "1h" });
    
            // Return token and success message
            res.json({ token, message: "Successfully logged in" });
        } catch (error) {
            console.error("Signin failed:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

// Creating a Course    
adminRouter.post("/createCourse",adminMiddleware, async(req,res)=>{
    const adminId = req.adminId;

    const{title, description, imageUrl, price} = req.body;

    const course = await courseModel.create({
        title, 
        description, 
        imageUrl, 
        price,
        creatorId : adminId
    })
    
    res.json({
        message : "Course Created",
        courseId : course._id
    })
})

// Updating Course Content
adminRouter.post("/updateCourseContent",adminMiddleware, async (req,res)=>{
    const adminId = req.adminId;

    const{title, description, imageUrl, price, courseId} = req.body;

// A must check condition is that the course that is being updated is create by that admin only and not some other admin 
    const course = await courseModel.updateOne({
        _id : courseId, creatorId: adminId},{
        title, 
        description, 
        imageUrl, 
        price,
        creatorId : adminId
    })
    
    res.json({
        message : "Course Updated",
        courseId : course._id
    })
})

// Deleting Course
adminRouter.post("/deleteCourse",adminMiddleware,async(req,res)=>{
    // Ensure only the admin who created the course can delete it

    const adminId = req.adminId;
    const { courseId } = req.body;

    try {
        // Check if the course exists and is created by the same admin
        const course = await courseModel.findOne({ _id: courseId, creatorId: adminId });

        if (!course) {
            return res.status(404).json({ message: "Course not found or you do not have permission to delete this course" });
        }

        // Delete the course
        await courseModel.deleteOne({ _id: courseId, creatorId: adminId });

        res.json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("Delete course failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = adminRouter;