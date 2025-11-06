import winston from "winston";
const { combine, timestamp, label, prettyPrint, colorize } = winston.format;
const logger = winston.createLogger({
  level: "error",
  format: combine(
    colorize(),
    label({ label: "right meow!" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logger.log" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});
logger.log({ level: "info", message: "bu test log" });
logger.log({ level: "warn", message: "ogohlantrish" });
logger.log({ level: "debug", message: "bugni topish" });
logger.log({ level: "error", message: "xatolik" });
logger.log({ level: "silly", message: "silly" });
