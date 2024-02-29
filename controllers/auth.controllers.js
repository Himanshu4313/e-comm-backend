import User from "../models/users.model.js";
import emailValidtor from "email-validator";

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

const login = async (req, res) => {};

const logout = async (req, res) => {};
export { signup, login, logout };
