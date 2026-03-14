# Eligix — Client

This repository now includes a minimal single-page client in `client/` that consumes the backend API endpoints:

- `GET /api/students` — list alumni/students
- `POST /api/students/register` — register a new alumni

To run locally:

```bash
npm install
npm start
# then open http://localhost:3000 in your browser
```

The client is served statically from the Express server at `/`.
