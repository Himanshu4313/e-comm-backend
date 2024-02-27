import app from "./app.js";
import { config } from "dotenv";
import connectToDatabase from "./configs/connect.db.js";
config();

const PORT = process.env.PORT || 3001;
// Start server on the port defined in .env file or 3001 if not present

connectToDatabase()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    
}).catch((err) =>{
     console.log("Error connecting to database", err);
});

// Handle any errors that occur while starting up the server
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: ", err); 
    // Close server and exit application after logging error
    process.exit(1);
});


