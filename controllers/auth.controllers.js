import User from "../models/users.model.js";
import emailValidtor from "email-validator";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  const userData = req.body;
  /**
   * 1 . Validate the request body to make sure it contains all required fields.
   */
  if (
    !userData.name ||
    !userData.email ||
    !userData.userId ||
    !userData.password
  ) {
    return res
      .status(401)
      .json({ message: "All fields are mandatory.Please fill up." });
  }

  /**
   * Check valid email or not
   */
  if (!emailValidtor.validate(userData.email)) {
    return res.status(401).json({
      message: "Invalid Email",
      success: false,
    });
  }

  try {
    /**
     * 2. check if user already exist then return a error message  saying that this email is already registered.
     */
    const user = await User.findOne({ email: userData.email });

    if (user) {
      return res.status(401).json({
        message:
          "This email  is already registered.Please try with another email.",
        success: false,
      });
    }
    /**
     * 3. if not user exist then create a new users in database  and save it.
     */
    const user_create = await User.create({
      name: userData.name,
      userId: userData.userId,
      email: userData.email,
      password: userData.password,
    });
    /**
     * Handle exception when new user is not created in database
     */
    if (!user_create) {
      return res.status(501).json({
        message: "User creation failed!",
        success: false,
      });
    }
    /**
     * 4 . if user successfully created at database then return  status code of 201(Created).
     */
    user_create.password = undefined; // remove password field before sending response
    return res.status(201).json({
      message: "user register successfully",
      success: true,
      users: user_create,
    });
  } catch (error) {
    console.log("Error occur while creating new user", error);
    return res
      .status(501)
      .json({ message: "Internal server error.Please try again" });
  }
};

const signin = async (req, res) => {
    /**
     * 1. take  data from request body
     */
    const {email , password} = req.body;

    /**
     * 2. check  the validation for user login credentials 
     */

    
    if(!email){
  
       return res.status(401).json({
          success:false,
          message:"Please provide email Id "
       })
      
    }

    if(!password){
      
      return  res.status(401).json({
            success:false,
            message:"Please enter password."
      });

    }
   
    try {
      
      // const user = await  User.findOne({
      //    $or : [{email} , {userId}]
      // });
      
      const user = await User.findOne({email},'+password');

      if(!user){
         return res.status(401).json({
             success:false,
             message:"Please provide  valid email id / userid and password."
         })
      }
  
      /**
       * 3. find  user on the basis of email or userId for login if user found then generate token  and send it to client side otherwise send error message
       */
      
      if(!bcrypt.compareSync(password, user.password)){
               
           return res.status(401).json({
                  success:false,
                  message:"Incorrect  Password!"
           });     
  
      }
      
      // generate token 
      
      const token = await user.generateToken();
  
      // remove password from the response object to secure it .
  
      user.password = undefined;
  
      const cookiesOption = {
          maxAge : 7*24*60*60, // for 7 days,
          httpOnly : true,
          secure : true,   // only works on https connection
      }
  
      res.cookie("token",token,cookiesOption);
      res.status(201).json({
          success:true,
          message:"signIn successfully..",
          accessToken: token
      })
    } catch (error) {
       console.log("Creating error while signin user",error);
       return res.status(501).json({
             success:false,
             message:"Failed to signIn Please try again."
       })
    }
};

const signout = async (req, res) => {

};
export { signup, signin , signout };
