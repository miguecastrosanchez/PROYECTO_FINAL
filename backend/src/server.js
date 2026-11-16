require("dotenv").config();
const app = require("./app");
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("Configura DATABASE_URL y una JWT_SECRET de 32+ caracteres en .env");
  process.exit(1);
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`DOBBY PLACE API disponible en http://localhost:${port}/api/health`));
