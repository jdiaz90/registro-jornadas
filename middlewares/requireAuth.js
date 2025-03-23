module.exports = (req, res, next) => {
    const rutasExcluidas = ['/auth/login', '/auth/logout'];
    const esRutaPublica = req.originalUrl.startsWith('/public');
  
    // Permitir acceso a las rutas excluidas y recursos públicos
    if (rutasExcluidas.includes(req.originalUrl) || esRutaPublica) {
      return next();
    }
  
    // Verificar si el usuario está autenticado
    if (!req.empleado) {
      return res.redirect('/auth/login');
    }
  
    next();
  };