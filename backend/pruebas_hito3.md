# DOBBY PLACE — Evidencias Hito 3

## Desarrollo Backend

Se implementó una API REST utilizando Node.js, Express y PostgreSQL mediante el paquete `pg`.

Se desarrollaron rutas para registrar usuarios, iniciar sesión, consultar publicaciones, crear, editar y eliminar publicaciones, y gestionar favoritos.

Para la autenticación se utilizó JWT, bcryptjs para proteger las contraseñas y middlewares para validar los permisos de los usuarios. También se configuró CORS para permitir las solicitudes del frontend.

## Pruebas realizadas

Se ejecutaron pruebas automatizadas utilizando Jest y Supertest mediante el comando `npm test`.

**Resultados:**
- 14 pruebas ejecutadas.
- 14 pruebas aprobadas.
- 0 pruebas fallidas.
- 1 suite aprobada.

Se comprobaron las rutas de usuarios, publicaciones y favoritos, incluyendo respuestas HTTP 200, 201, 401, 403, 404 y 409, además de la configuración CORS.

**Resultado:** Las pruebas automatizadas del Hito 3 finalizaron correctamente.