import winston from "winston";

const levels = {
  error: 0,
  info: 1,
};

const colors = {
  error: "red",
  info: "green",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  ),
  winston.format.printf(
    (error) => `${error.timestamp} ${error.level}: ${error.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const Logger = winston.createLogger({
  //   level,
  levels,
  format,
  transports,
});

export default Logger;
