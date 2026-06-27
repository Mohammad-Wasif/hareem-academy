import * as Sentry from "@sentry/node";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

if (process.env.GLITCHTIP_DSN) {
  Sentry.init({
    dsn: process.env.GLITCHTIP_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
}

const app: Express = express();

const PostgresStore = connectPgSimple(session);

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(helmet());

const allowedOrigins = [
  process.env.VITE_APP_URL,
  process.env.VITE_SITE_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
        (process.env.NODE_ENV !== "production" && (
          origin.startsWith("http://localhost:") || 
          origin.startsWith("http://127.0.0.1:")
        ));

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env["SESSION_SECRET"];
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

app.use(
  session({
    name: "hareem.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PostgresStore({
      pool: pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}, router);

app.get("/api/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);

export default app;