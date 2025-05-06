import express from "express";
import uploadRoute from "./routes/upload";

const app = express();
app.use(express.json());
app.use("/api", uploadRoute);

export default app;
