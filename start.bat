@echo off
echo.
echo ============================================================
echo  Trellis Finance -- Start Script
echo ============================================================
echo.

:: --- 1. Start PostgreSQL via Docker ---
echo [1/3] Starting PostgreSQL database...
docker compose up -d
if errorlevel 1 (
  echo ERROR: Docker not found or failed to start.
  echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop/
  pause & exit /b 1
)
echo Waiting for DB to be healthy...
timeout /t 5 /nobreak > nul

:: --- 2. Start Spring Boot backend ---
echo [2/3] Starting Spring Boot backend (port 8080)...
start "Trellis Backend" cmd /k "cd /d ""%~dp0trellis-finance-backend"" && mvnw.cmd spring-boot:run"

timeout /t 15 /nobreak > nul

:: --- 3. Start Vite frontend ---
echo [3/3] Starting Vite frontend (port 5173)...
start "Trellis Frontend" cmd /k "cd /d ""%~dp0trellis-finance-frontend"" && npm run dev"

echo.
echo ============================================================
echo  Trellis Finance is starting up:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo    Swagger:  http://localhost:8080/swagger-ui.html
echo ============================================================
echo.
