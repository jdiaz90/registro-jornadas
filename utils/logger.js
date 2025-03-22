const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
require('winston-daily-rotate-file');

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

// Configuración del transporte para rotación de logs
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log', // Nombre del archivo con fecha
  datePattern: 'YYYY-MM-DD', // Rotar diariamente
  maxSize: '5m', // Tamaño máximo del archivo (5 MB)
  maxFiles: '14d', // Mantener archivos de los últimos 14 días
});

// Crear el logger
const logger = createLogger({
  level: 'info', // Nivel mínimo de log (info, warn, error, etc.)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agregar timestamp
    logFormat
  ),
  transports: [
    // Transporte para mostrar logs en la consola con colores
    new transports.Console({
      format: combine(
        colorize(), // Agregar colores a los niveles de log
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // Transporte para guardar logs en archivos rotados
    dailyRotateFileTransport,
  ],
  exceptionHandlers: [
    // Manejar excepciones no controladas
    new transports.File({ filename: 'logs/exceptions.log' }), // Guardar excepciones en un archivo separado
    new transports.Console({
      format: combine(
        colorize(), // Colores para excepciones en la consola
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
  ],
  rejectionHandlers: [
    // Manejar promesas rechazadas no controladas
    new transports.File({ filename: 'logs/rejections.log' }), // Guardar rechazos en un archivo separado
    new transports.Console({
      format: combine(
        colorize(), // Colores para rechazos en la consola
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
  ],
});

// Agregar una función personalizada para registrar mensajes de sesión
logger.session = (message, level = 'info') => {
  switch (level) {
    case 'error':
      logger.error(`[SESSION] ${message}`);
      break;
    case 'warn':
      logger.warn(`[SESSION] ${message}`);
      break;
    case 'info':
    default:
      logger.info(`[SESSION] ${message}`);
      break;
  }
};

module.exports = logger;