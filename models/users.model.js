import mongoose from "mongoose";

const  Schema = mongoose.Schema;

// Create the model class for a user, inheriting from mongoose's Document class
let UserModel = new Schema({
    
},{timestamps:true , versionKey:false});

const User = mongoose.model("User", UserModel);

export default  User;