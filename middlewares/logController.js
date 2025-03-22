const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  // Excluir solicitudes a recursos estáticos
  if (req.originalUrl.startsWith('/css') || req.originalUrl.startsWith('/js') || req.originalUrl.startsWith('/images') || req.originalUrl.startsWith('/favicon.ico')) {
    return next();
  }

  // Obtener la hora local con el huso horario +1
  const now = new Date();
  const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora

  // Obtener el usuario autenticado o indicar que no está autenticado
  const usuario = req.empleado
    ? `${req.empleado.nombre} ${req.empleado.apellidos} (ID: ${req.empleado.id})`
    : 'Usuario no autenticado';

  // Obtener el controlador ejecutado
  const controlador = req.route ? req.route.path : req.originalUrl;

  // Registrar mensajes de sesión si existen
  const mensajeSesion = req.session?.mensaje || null;
  const tipoMensaje = req.session?.tipoMensaje || 'info';

  if (mensajeSesion) {
    const mensajeConUsuario = `[${localTime}] ${mensajeSesion} | Usuario: ${usuario}`;
    logger.session(mensajeConUsuario, tipoMensaje);
  }

  // Formatear el mensaje del log del controlador
  const logMessage = `[${localTime}] Controlador ejecutado: ${controlador} | Usuario: ${usuario}`;

  // Registrar el mensaje en la terminal
  logger.info(logMessage);

  next();
};