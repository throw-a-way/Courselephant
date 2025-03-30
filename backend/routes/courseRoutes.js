const express = require("express");
const { courseModel } = require("../db");
const courseRouter = express.Router();

courseRouter.post("/purchase",(req,res)=>{
    // Payment Utility
    res.json({
        message: "purchase endpoint"
    })
})

courseRouter.get("/",async (req,res)=>{

    try{
        // Fetch all documents from the "courses" collection
        const courses = await courseModel.find({});
        res.json(courses);
    }
    catch(e){
        res.status(500).json({
            message: "Failed to fetch courses"
        })
        console.log(e);
    }

    
})

module.exports = courseRouter;