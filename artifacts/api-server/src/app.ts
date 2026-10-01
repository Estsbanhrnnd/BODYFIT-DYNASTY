import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// 1. Cabeceras de seguridad HTTP con Helmet (XSS, Clickjacking, Sniffing protection)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Rate Limiting Global (Protección contra DDoS y spam de peticiones)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 200, // 200 peticiones por minuto por IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones desde este dispositivo. Por favor espera un momento.",
    retryAfter: 60,
  },
});
app.use(globalLimiter);

// 3. Rate Limiter específico para canje de códigos de regalo (evita ataques de fuerza bruta)
const giftCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 25, // máximo 25 intentos por IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Límite de canjes alcanzado. Intenta de nuevo en 15 minutos.",
  },
});
app.use("/api/gift-codes/redeem", giftCodeLimiter);

// 4. Rate Limiter para escáner fotográfico con IA
const foodScanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 25, // máximo 25 fotos por minuto por IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Límite de análisis de comida alcanzado por este minuto. Espera un momento.",
  },
});
app.use("/api/food-analysis", foodScanLimiter);

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
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  logger.warn("CLERK_SECRET_KEY no configurada. Servidor en modo desarrollo.");
}
app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
