import express from "express";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import field from "./routes/api/field";
import container from "./routes/api/container";
import doc from "./routes/api/doc";

var router = express.Router();
