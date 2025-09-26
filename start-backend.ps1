# Multi-Tenant E-Commerce Backend Startup Script
Write-Host "🚀 Multi-Tenant E-Commerce Backend Startup Script" -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Write-Host "📂 Navigating to backend directory..." -ForegroundColor Yellow
Set-Location "d:\Programming\gitrepo\mern-ecommerce-multitenant\backend"

# Check if node_modules exists
Write-Host "📦 Checking if node_modules exists..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "❌ node_modules not found! Installing dependencies..." -ForegroundColor Red
    npm install
} else {
    Write-Host "✅ node_modules found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Environment Check:" -ForegroundColor Cyan
Write-Host "Node Version: " -NoNewline
node --version
Write-Host "NPM Version: " -NoNewline
npm --version

Write-Host ""
Write-Host "📋 Available Scripts:" -ForegroundColor Cyan
Write-Host "1. Start main server (node index.js)"
Write-Host "2. Start test server (node test-server.js)"
Write-Host "3. Install dependencies (npm install)"
Write-Host "4. Start with npm script (npm run backend)"
Write-Host "5. Exit"

Write-Host ""
$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Starting main server..." -ForegroundColor Green
        node index.js
    }
    "2" {
        Write-Host "🧪 Starting test server..." -ForegroundColor Green
        node test-server.js
    }
    "3" {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        Read-Host "Press Enter to continue..."
    }
    "4" {
        Write-Host "🚀 Starting with npm script..." -ForegroundColor Green
        npm run backend
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit
    }
    default {
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
        Read-Host "Press Enter to continue..."
    }
}

Read-Host "Press Enter to continue..."