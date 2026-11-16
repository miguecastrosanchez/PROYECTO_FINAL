const router = require("express").Router();
const pool = require("../config/db");
const { verificarToken } = require("../middlewares/auth");
router.use(verificarToken);

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.id, f.usuario_id AS user_id, f.publicacion_id AS publication_id,
       json_build_object('title', p.titulo, 'price', p.precio) AS publication
       FROM favoritos f JOIN publicaciones p ON p.id = f.publicacion_id
       WHERE f.usuario_id = $1 ORDER BY f.id DESC`, [req.usuario.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const id = req.body.publication_id;
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "publication_id inválido" });
    const { rows } = await pool.query(
      "SELECT id FROM publicaciones WHERE id = $1", [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    const agregado = await pool.query(
      "INSERT INTO favoritos (usuario_id, publicacion_id) VALUES ($1,$2) ON CONFLICT (usuario_id, publicacion_id) DO NOTHING RETURNING id, usuario_id AS user_id, publicacion_id AS publication_id",
      [req.usuario.id, id]
    );
    if (!agregado.rows[0]) return res.status(409).json({ error: "Ya guardaste esta publicación" });
    res.status(201).json(agregado.rows[0]);
  } catch (err) { next(err); }
});

router.delete("/:publicationId", async (req, res, next) => {
  try {
    const id = Number(req.params.publicationId);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });
    const { rowCount } = await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = $1 AND publicacion_id = $2",
      [req.usuario.id, id]
    );
    if (!rowCount) return res.status(404).json({ error: "Favorito no encontrado" });
    res.json({ message: "Favorito eliminado" });
  } catch (err) { next(err); }
});
module.exports = router;
