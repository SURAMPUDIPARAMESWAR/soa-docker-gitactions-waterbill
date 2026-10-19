# WaterBill frontend

This Vite React application provides a small dashboard for the WaterBill Spring Boot service.

## Run locally

1. Start the backend on port `1427` from `WaterBill`.
2. Install frontend dependencies and start Vite:

   ```powershell
   npm install
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and sends `/waterbill` requests to the backend URL configured by `VITE_API_URL` in `.env`.

## Run with Docker Compose

The Compose frontend is available at `http://localhost:3004`. Its production
build uses `VITE_API_URL=http://localhost:2007`, so browser requests are sent
to the backend through the published port `2007`.

Build and start all containers from the repository root:

```powershell
docker compose up --build -d
```

The backend health endpoint is available at
`http://localhost:2007/waterbill/`.
