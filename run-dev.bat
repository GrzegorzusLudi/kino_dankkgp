@echo off
echo Building frontend...
cd frontend
call npx nx run browser:build --configuration=development --skip-nx-cache
if %errorlevel% neq 0 (
    echo Frontend build failed!
    cd ..
    exit /b %errorlevel%
)
echo Starting server...
cd ..\server
call python3 -m venv .venv
call .venv\Scripts\activate.bat
flask --app server run
