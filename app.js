import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";


const app = express();

app.use(express.json()); // for parsing application/json 

// parse text as url-encoded data with the query string parser 
app.use(express.urlencoded({ extended: true })); 

//croos origin  middleware  to allow cross-origin requests
app.use(cors({
  origin:'', // here you insert your frontend url 
  credentials: true
}));

// this middleware is used for cookie parser
app.use(cookieParser())


// Authentication related routes
app.use("/ecommerce/api/v1/auth",authRouter);

// Category related routes
app.use("/ecommerce/api/v1/category",categoryRouter);

// Product related routes
app.use("/ecommerce/api/v1/product",productRouter);


app.get("/", (req, res) => {
  res.send("Welcome to e-commerce server",);
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "OOPS Page is not Found" });
});



export default app;
