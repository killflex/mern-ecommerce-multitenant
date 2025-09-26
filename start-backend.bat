@echo off
echo 🚀 Multi-Tenant E-Commerce Backend Startup Script
echo.

echo 📂 Navigating to backend directory...
cd /d "d:\Programming\gitrepo\mern-ecommerce-multitenant\backend"

echo 📦 Checking if node_modules exists...
if not exist "node_modules" (
    echo ❌ node_modules not found! Installing dependencies...
    npm install
) else (
    echo ✅ node_modules found!
)

echo.
echo 🔧 Environment Check:
echo Node Version: 
node --version
echo NPM Version:
npm --version

echo.
echo 📋 Available Scripts:
echo 1. Start main server (node index.js)
echo 2. Start test server (node test-server.js)
echo 3. Install dependencies (npm install)
echo 4. Exit

echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 🚀 Starting main server...
    node index.js
) else if "%choice%"=="2" (
    echo 🧪 Starting test server...
    node test-server.js
) else if "%choice%"=="3" (
    echo 📦 Installing dependencies...
    npm install
    pause
) else if "%choice%"=="4" (
    echo 👋 Goodbye!
    exit
) else (
    echo ❌ Invalid choice!
    pause
)

pause