import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const authTokenCheck = function  (req, res, next) {
        const { token } =  req.cookies;

        if(token == null){
            return res.status(401).json({
                success:false,
                message:"Not authorized user.Please signin"
            });
        }

        try {
           const userDetails = jwt.verify(token,process.env.JWT_SECRET);
           
           req.user = userDetails;  
        //    console.log("JWT secret key :" , process.env.JWT_SECRET);
           next();

        } catch (error) {
            console.log("Error in verify token", error);
            return res.status(501).json({
                success:false,
                message:"Failed to verify  the token."
            });
        }
}

export  {
    authTokenCheck
}