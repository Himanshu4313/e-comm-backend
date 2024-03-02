import User from "../models/users.model.js";
import emailValidtor from "email-validator";
import bcrypt from "bcryptjs";
import { createOTP } from "../utils/generateOTP.js";
import sendEmail from "../utils/send.email.js";
import crypto from "crypto";

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
  const { email, password } = req.body;

  /**
   * 2. check  the validation for user login credentials
   */

  if (!email) {
    return res.status(401).json({
      success: false,
      message: "Please provide email Id ",
    });
  }

  if (!password) {
    return res.status(401).json({
      success: false,
      message: "Please enter password.",
    });
  }

  try {
    // const user = await  User.findOne({
    //    $or : [{email} , {userId}]
    // });

    const user = await User.findOne({ email }, "+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please provide  valid email id / userid and password.",
      });
    }

    /**
     * 3. find  user on the basis of email or userId for login if user found then generate token  and send it to client side otherwise send error message
     */

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Incorrect  Password!",
      });
    }

    // generate token

    const token = await user.generateToken();

    // remove password from the response object to secure it .

    user.password = undefined;

    const cookiesOption = {
      maxAge: 7 * 24 * 60 * 60, // for 7 days,
      httpOnly: true,
      secure: true, // only works on https connection
    };

    res.cookie("token", token, cookiesOption);
    res.status(201).json({
      success: true,
      message: "signIn successfully..",
      accessToken: token,
    });
  } catch (error) {
    console.log("Creating error while signin user", error);
    return res.status(501).json({
      success: false,
      message: "Failed to signIn Please try again.",
    });
  }
};

const signout = async (req, res) => {
  /**
   * take user details from req.user
   */
  const user = req.user;

  // console.log(user); //object

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not  authorized! You are not signIn",
    });
  }

  try {
    /**
     * if this user is exist in the database then signout  otherwise send an error massage that you are not signin in yet.
     */
    const userExists = await User.findById(user._id);

    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "Not  valid user!",
      });
    }

    const cookieOption = {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    };

    res.cookie("token", null, cookieOption);

    res.status(201).json({
      success: true,
      message: "Sign out successfully. See you soon.",
    });
  } catch (error) {
    console.log("Error in signing out the user ", error);
    res.status(501).json({
      success: false,
      message: "Failed to sign out.Please try again",
    });
  }
};

const forgotPassword = async (req, res) => {
  /**
   * 1. First we take email id  from request body and check whether it is present or not?
   * If yes then next step will be
   */
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({
      success: false,
      message: "Email fields is required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not vaild user.Please provide me correct email",
    });
  }

  /**
   *  if user is valid then generate a otp and send to the given or valid email address.
   *
   */
  const OTP = createOTP();

  user.Otp = OTP;

  user.OtpexpiresIn = Date.now() + 300000; // Otp expire after 6 mins

  await user.save();

  const subject = `OTP verification for forgot-password from e-commerce`;
  const message = `<p>To authenticate, please use the following One Time Password (OTP):</p><br> <b>${OTP}</b> <br> <p>Don't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card , or banking info.</p> <br> <p>We hope to see you again soon.</p>`;

  await sendEmail(email, subject, message);

  res.status(201).json({
    success: true,
    message: "OTP has been send in your registered emailID successfully.",
  });
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(401).json({
      success: false,
      message: "Please enter OTP (One Time Password)",
    });
  }

  try {
    const user = await User.findOne({ Otp: otp }); // here we verify otp  with database

    if (user == null) {
      return res.status(401).json({
        success: false,
        message: "Please enter correct OTP",
      });
    }

    if (user.OtpexpiresIn < Date.now()) {
      user.Otp = undefined;
      user.OtpexpiresIn = undefined;

      await user.save();

      return res.status(401).json({
        success: false,
        message: "Your OTP is Expired.",
      });
    }

    user.Otp = undefined;
    user.OtpexpiresIn = undefined;


    res.status(201).json({
      success: true,
      message: "Verification Successful",
    });
  } catch (error) {
    console.log("Error while verifyOTP", error);
    return res.status(501).json({
      success: false,
      message: "Oops. Something went wrong!",
    });
  }
};

const resetPassword = async (req, res) => {
   // email take 
  //  new password
  // confirm password

  const {email , newPassword, confirmPassword} = req.body;
  try {
    // then set in the database and return success full message to the customer/user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found"
      });
    } 
    
    if(newPassword !== confirmPassword){
        return res.status(401).json({
              success:false,
              message:"Your newPassword and confirmPassword is doesn't match"
        })
    }

    user.password = confirmPassword;

    await user.save();

    res.status(201).json({
        success: true,
        message:"Successfully change  your Password.",
    });

  } catch (error) {
    console.log("Error while Reset Password : ", error);
    return res.status(501).json({
          success:false,
          message:"Faileds to forgot your password.Please try again"
    });
  }
};
export { signup, signin, signout, forgotPassword, verifyOTP, resetPassword };
