import express from "express";

const app = express();


app.get("/", (req, res) => {
  res.send("Welcome to e-commerce server");
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "OOPS Page is not Found" });
});



export default app;
