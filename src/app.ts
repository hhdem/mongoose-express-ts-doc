import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware";
import connectDB from "../config/database";
import Router from "./api_v1";
import { createRateLimiter } from "./middleware/rateLimit.middleware";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

const app = express();
// Connect to MongoDB
connectDB();
// Helmet
app.use(helmet());
// Rate Limit
app.use(createRateLimiter());
app.use(morgan("tiny"));
app.use(express.static("public"));
// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);
app.use(Router);
app.use(errorMiddleware);
export default app;
