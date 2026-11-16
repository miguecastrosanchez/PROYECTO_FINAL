const router = require("express").Router();
const pool = require("../config/db");
const { verificarToken } = require("../middlewares/auth");
router.use(verificarToken);

router.get("/me", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre AS name, email, lugar AS place FROM usuarios WHERE id = $1",
      [req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.put("/me", async (req, res, next) => {
  try {
    const { name, place } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof place !== "string" || !place.trim()) {
      return res.status(400).json({ error: "Debes enviar name y place" });
    }
    const { rows } = await pool.query(
      "UPDATE usuarios SET nombre = $1, lugar = $2 WHERE id = $3 RETURNING id, nombre AS name, email, lugar AS place",
      [name.trim(), place.trim(), req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});
module.exports = router;
