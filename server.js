import app from "./app.js";
import { config } from "dotenv";
import connectToDatabase from "./configs/connect.db.js";
config();
import User from "./models/users.model.js";
import cloudinary from "cloudinary";


const PORT = process.env.PORT || 3001;
// Start server on the port defined in .env file or 3001 if not present

// configure cloudinary 

cloudinary.v2.config({
  cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET,
})


connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    init();
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

async function init() {
  try {
    let user = await User.findOne({ userId: "admin" });

    if (user) {
      console.log("Admin user already present");
      return;
    }
  } catch (error) {
    console.log("Error while reading the  data base", error);
  }

  try {
    const  user = await User.create({
      name: "Himanshu",
      userId: "admin",
      email: "hk225064@gmail.com",
      password: "welcome1",
      userType: "ADMIN",
    });

    console.log(user);
  } catch (error) {
    console.log("Admin creation failed", error);
  }
}
// Handle any errors that occur while starting up the server
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
  // Close server and exit application after logging error
  process.exit(1);
});
