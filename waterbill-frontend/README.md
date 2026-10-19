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
