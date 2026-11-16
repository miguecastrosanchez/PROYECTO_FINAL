// Pruebas HTTP sin depender de una base de datos real: mockeamos el módulo de PostgreSQL.
process.env.JWT_SECRET = "clave_de_pruebas_larga_que_no_se_usara_en_produccion_123";
process.env.CORS_ORIGIN = "http://localhost:5174";
jest.mock("../src/config/db", () => ({ query: jest.fn() }));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../src/config/db");
const app = require("../src/app");
const token = jwt.sign({ id: 10, email: "miguel@ejemplo.cl" }, process.env.JWT_SECRET);
const auth = `Bearer ${token}`;

beforeEach(() => pool.query.mockReset());

test("GET /api/health devuelve 200", async () => {
  const r = await request(app).get("/api/health");
  expect(r.status).toBe(200);
  expect(r.body.status).toBe("ok");
});

test("GET /api/publications devuelve 200 y datos", async () => {
  pool.query.mockResolvedValue({ rows: [{ id: 1, title: "Polera Move", price: 19990 }] });
  const r = await request(app).get("/api/publications");
  expect(r.status).toBe(200);
  expect(r.body[0].title).toBe("Polera Move");
});

test("GET /api/publications/99 devuelve 404", async () => {
  pool.query.mockResolvedValue({ rows: [] });
  const r = await request(app).get("/api/publications/99");
  expect(r.status).toBe(404);
});

test("POST /api/auth/register devuelve 201 sin revelar el hash", async () => {
  pool.query.mockResolvedValue({ rows: [{ id: 10, nombre: "Miguel", email: "miguel@ejemplo.cl", lugar: "Iquique" }] });
  const r = await request(app).post("/api/auth/register").send({
    name: "Miguel", email: "miguel@ejemplo.cl", place: "Iquique",
    password: "ClaveSegura123", confirmPassword: "ClaveSegura123"
  });
  expect(r.status).toBe(201);
  expect(r.body.user.email).toBe("miguel@ejemplo.cl");
  expect(r.body.user.password_hash).toBeUndefined();
});

test("POST /api/auth/login devuelve JWT con credenciales correctas", async () => {
  const hash = await bcrypt.hash("ClaveSegura123", 4);
  pool.query.mockResolvedValue({ rows: [{ id: 10, nombre: "Miguel", email: "miguel@ejemplo.cl", lugar: "Iquique", password_hash: hash }] });
  const r = await request(app).post("/api/auth/login").send({ email: "miguel@ejemplo.cl", password: "ClaveSegura123" });
  expect(r.status).toBe(200);
  expect(jwt.verify(r.body.token, process.env.JWT_SECRET).id).toBe(10);
});

test("POST /api/auth/login devuelve 401 con contraseña incorrecta", async () => {
  const hash = await bcrypt.hash("ClaveSegura123", 4);
  pool.query.mockResolvedValue({ rows: [{ id: 10, password_hash: hash }] });
  const r = await request(app).post("/api/auth/login").send({ email: "miguel@ejemplo.cl", password: "Incorrecta" });
  expect(r.status).toBe(401);
});

test("GET /api/users/me devuelve 401 sin token", async () => {
  const r = await request(app).get("/api/users/me");
  expect(r.status).toBe(401);
  expect(pool.query).not.toHaveBeenCalled();
});

test("GET /api/users/me devuelve 200 con Bearer válido", async () => {
  pool.query.mockResolvedValue({ rows: [{ id: 10, name: "Miguel", email: "miguel@ejemplo.cl", place: "Iquique" }] });
  const r = await request(app).get("/api/users/me").set("Authorization", auth);
  expect(r.status).toBe(200);
  expect(r.body.id).toBe(10);
});

test("POST /api/publications devuelve 401 sin token", async () => {
  const r = await request(app).post("/api/publications").send({ title: "Prenda" });
  expect(r.status).toBe(401);
});

test("POST /api/publications devuelve 201 y toma user_id del token", async () => {
  pool.query.mockResolvedValue({ rows: [{ id: 4, usuario_id: 10, title: "Polera", price: 10000 }] });
  const r = await request(app).post("/api/publications").set("Authorization", auth).send({
    title: "Polera", description: "Cómoda", price: 10000, category: "Poleras",
    size: "M", place: "Iquique", usuario_id: 999
  });
  expect(r.status).toBe(201);
  expect(r.body.usuario_id).toBe(10);
  expect(pool.query.mock.calls[0][1][0]).toBe(10);
});

test("PUT /api/publications/1 devuelve 403 cuando no es el dueño", async () => {
  pool.query.mockResolvedValueOnce({ rows: [{ usuario_id: 22 }] });
  const r = await request(app).put("/api/publications/1")
    .set("Authorization", auth).send({ title: "Cambio" });
  expect(r.status).toBe(403);
});

test("DELETE /api/publications/1 devuelve 200 para el dueño", async () => {
  pool.query.mockResolvedValueOnce({ rows: [{ usuario_id: 10 }] });
  pool.query.mockResolvedValueOnce({ rowCount: 1 });
  const r = await request(app).delete("/api/publications/1").set("Authorization", auth);
  expect(r.status).toBe(200);
});

test("POST /api/favorites devuelve 409 al intentar duplicar", async () => {
  pool.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });
  pool.query.mockResolvedValueOnce({ rows: [] });
  const r = await request(app).post("/api/favorites").set("Authorization", auth)
    .send({ publication_id: 2 });
  expect(r.status).toBe(409);
});

test("CORS permite el origen configurado", async () => {
  const r = await request(app).get("/api/health").set("Origin", "http://localhost:5174");
  expect(r.headers["access-control-allow-origin"]).toBe("http://localhost:5174");
});
