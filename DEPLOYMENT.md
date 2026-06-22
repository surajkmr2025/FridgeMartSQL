# FridgeMartSQL Deployment

This project is ready to deploy as one Node service that serves both:

- the Express API from `BACKEND/`
- the built React/Vite app from `FRONTEND/dist`

## Recommended: Railway

Railway is the simplest fit because the project needs both a web service and MySQL.

1. Push this repository to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Add a MySQL database service to the same Railway project.
4. In the web service variables, set:

```text
NODE_ENV=production
JWT_SECRET=replace_with_a_long_random_secret
```

The backend automatically reads Railway MySQL variables:

```text
MYSQLHOST
MYSQLPORT
MYSQLUSER
MYSQLPASSWORD
MYSQLDATABASE
```

5. Generate a public domain for the web service.
6. Run `DATABASE/schema.sql` once against the Railway MySQL database.

Railway will use the `Dockerfile` at the repo root. The Docker build installs backend and frontend dependencies, builds the frontend, and starts `BACKEND/server.js`.

## Local Production Check

```bash
npm run test
```

This runs backend tests, frontend lint, and frontend build.

## Notes

- Do not commit `BACKEND/.env`; use hosting environment variables instead.
- If deploying somewhere other than Railway, set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- The production server serves the frontend from `FRONTEND/dist`.
