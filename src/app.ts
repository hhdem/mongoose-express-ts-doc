import bodyParser from "body-parser";
import express from "express";
import errorMiddleware from "./middleware/error.middleware";
import connectDB from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import field from "./routes/api/field";
import container from "./routes/api/container";
import doc from "./routes/api/doc";
import { createRateLimiter } from "./middleware/rateLimit.middleware";
import helmet from "helmet";

const app = express();

// Connect to MongoDB
connectDB();
// Helmet
app.use(helmet());
// Rate Limit
app.use(createRateLimiter());
// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/field", field);
app.use("/api/doc", doc);
app.use("/api/container", container);

app.use(errorMiddleware);
export default app;
