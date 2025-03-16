// middlewares/verificarToken.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.redirect('/login');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }
    req.empleado = decoded;
    next();
  });
}

module.exports = verificarToken;
