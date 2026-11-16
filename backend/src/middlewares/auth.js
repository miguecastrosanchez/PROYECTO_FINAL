const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;
  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Debes enviar un token Bearer" });
  }
  const token = autorizacion.slice(7);
  try {
    // La clave JWT jamás viene desde el navegador.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
module.exports = { verificarToken };
