const { Pool } = require("pg");
require("dotenv").config();

// Pool administra conexiones reutilizables a PostgreSQL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
