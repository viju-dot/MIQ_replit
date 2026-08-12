import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

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
app.use(cors());
// Modest global body limit (this API only handles small JSON payloads). The
// shares router additionally rejects >64kb via Content-Length before work.
app.use(express.json({ limit: "128kb" }));
app.use(express.urlencoded({ extended: true, limit: "128kb" }));

app.use("/api", router);

export default app;
