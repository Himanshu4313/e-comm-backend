import mongoose from "mongoose";
import { config } from "dotenv";
config();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please provide the MongoDB URI in the .env file");
}

// Set up default mongoose connection

async function connectToDatabase() {
  await mongoose
    .connect(MONGODB_URI)
    .then((conn) => {
      console.log(`Database connected successfully at ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDb connection  error: ", err);
      process.exit(1);
    });
}

export default connectToDatabase;
