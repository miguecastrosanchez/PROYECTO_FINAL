const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const emailValido = (email) => typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const publico = (u) => ({ id: u.id, name: u.nombre, email: u.email, place: u.lugar });

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, place, password, confirmPassword } = req.body;
    if (![name, place].every((v) => typeof v === "string" && v.trim()) ||
        !emailValido(email) || typeof password !== "string" || password.length < 8 ||
        password !== confirmPassword) {
      return res.status(400).json({ error: "Revisa nombre, correo, lugar y contraseñas (mínimo 8 caracteres)" });
    }
    const correo = email.trim().toLowerCase();
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre, email, lugar, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, lugar",
      [name.trim(), correo, place.trim(), hash]
    );
    res.status(201).json({ message: "Usuario registrado", user: publico(rows[0]) });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!emailValido(email) || typeof password !== "string") {
      return res.status(400).json({ error: "Correo o contraseña inválidos" });
    }
    const { rows } = await pool.query(
      "SELECT id, nombre, email, lugar, password_hash FROM usuarios WHERE email = $1",
      [email.trim().toLowerCase()]
    );
    const usuario = rows[0];
    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );
    res.json({ token, user: publico(usuario) });
  } catch (err) { next(err); }
});
module.exports = router;
