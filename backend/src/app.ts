import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"
import sweetRouter from "./routes/sweets"
import categoryRouter from "./routes/category"
import { globalErrorHandler } from "./middlewares/error.middleware"

const app = express();

app.use(cors());
app.use(express.json());

// router for user registration and login
app.use("/api/auth", authRouter);

// router for add category for sweet "before add sweets"
app.use("/api/category", categoryRouter)

// router for perform operation on sweets
app.use("/api/sweets", sweetRouter);



// handle global error for not show internal error info to user
app.use(globalErrorHandler);

export default app;