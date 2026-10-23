import "dotenv/config";
import winston from "winston";
import path from "node:path";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: process.env.LOG_LEVEL || "http",

  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),

    new winston.transports.File({
      filename: path.resolve(process.cwd(), "logs/error.log"),
      level: "error",
      format: logFormat,
    }),

    new winston.transports.File({
      filename: path.resolve(process.cwd(), "logs/combined.log"),
      format: logFormat,
    }),
  ],
});
