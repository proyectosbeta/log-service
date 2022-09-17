"use strict";

import express from "express";
import createLocaleMiddleware from "express-locale";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { router as rest } from "./routes/index.js";
import { startPolyglot } from "./middleware/startPolyglot.middleware.js";

const methodOverride = require("method-override");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const app = express();

// Add data parsing to express.
app.use(express.json());

// Translation. English default language.
app.use(
  createLocaleMiddleware({
    priority: ["accept-language", "default"],
    default: "en-US",
  })
);

// Set the language in the req with the phrases to be used.
app.use(startPolyglot);

// Security.
app.use(helmet());
app.use(cors());

app.use(methodOverride());
app.use(limiter);

// Register the API REST routes.
app.use("/api/", rest);

export { app };
