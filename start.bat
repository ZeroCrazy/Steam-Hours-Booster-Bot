@echo off
REM Steam Hours Booster Bot - Start Script
cd /d "%~dp0"

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/.
    pause
    exit /b
)

REM Run the steam_app.js file with Node.js
node steam_app.js

REM Keep the window open after execution
pause
