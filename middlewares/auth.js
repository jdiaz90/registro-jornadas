// middlewares/auth.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // Intentamos obtener el token de una cookie o del header Authorization
  const tokenFromCookie = req.cookies && req.cookies.token;
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  
  // Se utiliza el token encontrado, ya sea de la cookie o del header
  const token = tokenFromCookie || tokenFromHeader;
  
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }

  // Verifica el token usando la clave secreta definida en process.env.JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    // Almacena la información decodificada del token en req, para que pueda usarse en rutas protegidas
    req.empleado = decoded;
    next();
  });
}

module.exports = verificarToken;
