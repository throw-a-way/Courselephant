const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({

    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName: String 
})

const adminSchema = new Schema({
    
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName: String
})

const courseSchema = new Schema({
    
    title : String,
    description : String,
    price : Number,
    imageURL : String,
    creatorId : ObjectId
})

const purchaseSchema = new Schema({
// NEED TO MAKE THIS FUNCTIONAL USING REFERENCES / Relationships in Mongodb
    courseId : ObjectId,
    userId : ObjectId
})

const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}