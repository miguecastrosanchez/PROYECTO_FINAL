require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/errors");

const app = express();
const origenes = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",").map((origen) => origen.trim());
app.use(cors({ origin: origenes }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "DOBBY PLACE" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/publications", require("./routes/publications"));
app.use("/api/favorites", require("./routes/favorites"));
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
