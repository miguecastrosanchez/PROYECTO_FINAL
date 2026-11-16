const router = require("express").Router();
const pool = require("../config/db");
const { verificarToken } = require("../middlewares/auth");

const columns = "p.id, p.usuario_id, p.titulo AS title, p.descripcion AS description, p.precio AS price, p.categoria AS category, p.talla AS size, p.lugar AS place, p.imagen_url AS image_url";
const idValido = (value) => /^[1-9]\d*$/.test(String(value)) && Number.isSafeInteger(Number(value));
const camposPermitidos = ["title", "description", "price", "category", "size", "place", "image_url"];
const mapeo = { title: "titulo", description: "descripcion", price: "precio", category: "categoria", size: "talla", place: "lugar", image_url: "imagen_url" };
const valido = (k, v) => {
  if (k === "price") return Number.isSafeInteger(v) && v > 0;
  if (k === "image_url") return v === null || (typeof v === "string" && v.length <= 2048);
  return typeof v === "string" && v.trim().length > 0 && v.length <= (k === "description" ? 10000 : 150);
};

// IMPORTANTE: /mine debe aparecer ANTES de /:id.
router.get("/mine", verificarToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${columns} FROM publicaciones p WHERE p.usuario_id = $1 ORDER BY p.id DESC`,
      [req.usuario.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${columns} FROM publicaciones p ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: "ID inválido" });
    const { rows } = await pool.query(
      `SELECT ${columns}, u.nombre AS seller_name FROM publicaciones p JOIN usuarios u ON u.id = p.usuario_id WHERE p.id = $1`,
      [Number(req.params.id)]
    );
    if (!rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.post("/", verificarToken, async (req, res, next) => {
  try {
    const datos = req.body;
    const obligatorios = ["title", "description", "price", "category", "size", "place"];
    if (obligatorios.some((key) => !valido(key, datos[key])) ||
        (datos.image_url !== undefined && !valido("image_url", datos.image_url))) {
      return res.status(400).json({ error: "Datos de publicación inválidos" });
    }
    const { rows } = await pool.query(
      `INSERT INTO publicaciones (usuario_id, titulo, descripcion, precio, categoria, talla, lugar, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, usuario_id, titulo AS title, descripcion AS description, precio AS price, categoria AS category, talla AS size, lugar AS place, imagen_url AS image_url`,
      [req.usuario.id, datos.title.trim(), datos.description.trim(), datos.price, datos.category.trim(), datos.size.trim(), datos.place.trim(), datos.image_url || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put("/:id", verificarToken, async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: "ID inválido" });
    const campos = Object.keys(req.body).filter((k) => camposPermitidos.includes(k));
    if (!campos.length || campos.some((k) => !valido(k, req.body[k])) ||
        Object.keys(req.body).some((k) => !camposPermitidos.includes(k))) {
      return res.status(400).json({ error: "Campos de actualización inválidos" });
    }
    const id = Number(req.params.id);
    const actual = await pool.query("SELECT usuario_id FROM publicaciones WHERE id = $1", [id]);
    if (!actual.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (actual.rows[0].usuario_id !== req.usuario.id) {
      return res.status(403).json({ error: "No tienes permiso para modificar esta publicación" });
    }
    const valores = campos.map((k) => typeof req.body[k] === "string" && k !== "image_url" ? req.body[k].trim() : req.body[k]);
    const cambios = campos.map((k, i) => `${mapeo[k]} = $${i + 1}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE publicaciones SET ${cambios} WHERE id = $${campos.length + 1} AND usuario_id = $${campos.length + 2}
       RETURNING id, usuario_id, titulo AS title, descripcion AS description, precio AS price, categoria AS category, talla AS size, lugar AS place, imagen_url AS image_url`,
      [...valores, id, req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete("/:id", verificarToken, async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: "ID inválido" });
    const id = Number(req.params.id);
    const actual = await pool.query("SELECT usuario_id FROM publicaciones WHERE id = $1", [id]);
    if (!actual.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (actual.rows[0].usuario_id !== req.usuario.id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta publicación" });
    }
    const { rowCount } = await pool.query(
      "DELETE FROM publicaciones WHERE id = $1 AND usuario_id = $2", [id, req.usuario.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Publicación no encontrada" });
    res.json({ message: "Publicación eliminada" });
  } catch (err) { next(err); }
});
module.exports = router;
