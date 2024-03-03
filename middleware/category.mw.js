import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const categoryAuth = (req, res, next) => {
  const {token} = req.cookies;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Not authorized user.Please signIn your self",
    });
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userData;

    if (userData.userType !== "ADMIN") {
      return res.status(401).send({
        success: false,
        message: "Not authorized to perform this action.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in category auth middleware", error);
    return res.status(501).send({
      success: false,
      message: "Failed to authenticate category users.",
    });
  }
};

export { categoryAuth };
