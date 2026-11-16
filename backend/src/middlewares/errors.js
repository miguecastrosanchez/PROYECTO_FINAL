function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

function manejarErrores(err, req, res, next) {
  if (err.code === "23505") {
    return res.status(409).json({ error: "El registro ya existe" });
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "JSON inválido" });
  }
  console.error("Error del servidor:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
}
module.exports = { rutaNoEncontrada, manejarErrores };
