import mongoose from "mongoose";

const Schema = mongoose.Schema ;

const categorySchema = new Schema({

     name : {
         type : String,
         required : [true , "This category fields are mandatory"] ,
         unique : true,
         maxlength: 50
     },

     description : {
        type : String ,
        required: [true , "description is required"]
     }

},{timestamps : true , versionKey :false} );

const Category = mongoose.model("Category",categorySchema);

 export default Category;