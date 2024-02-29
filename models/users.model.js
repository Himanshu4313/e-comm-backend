import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

// Create the model class for a user, inheriting from mongoose's Document class
let UserModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name fields is mandatory"],
      minLength: [5, "Name should be atleast 5 character"],
    },

    userId: {
      type: String,
      required: [true, "User Id fields  is mandatory"],
      lowercase: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is mandatory"],
      lowercase: true,
      unique: true,
      trim : true
    },

    password: {
      type: String,
      required: [true, "Password fields are mandatory"],
      minLength: [8],
      select: false, //hides this field while querying, used to hide passwords in responses , default is false ,
    },

    userType: {
      type: String,
      required: [true, "This fields is mandatory"],
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },
  },
  { timestamps: true, versionKey: false }
);


// password save as encrypted in database .
UserModel.pre("save",  function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    this.password =  bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model("User", UserModel);
export default User;
