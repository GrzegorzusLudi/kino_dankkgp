@echo off
echo Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b %errorlevel%
)
echo Starting server...
cd ..\server
call python3 -m venv .venv
call .venv\Scripts\activate.bat
flask --app server run
