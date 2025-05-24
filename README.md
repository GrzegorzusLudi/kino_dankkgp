# Kino DANKKGP

# Backend

## Running on Linux

```bash
cd server
python3 -m venv .venv
. .venv/bin/activate
pip install Flask
pip install flask-socketio
pip install python-dotenv
pip install google-api-python-client
flask --app server run
```

## Running on Windows

```
cd server
python3 -m venv .venv
cd .venv/Scripts
activate.bat
cd ../../
pip install Flask
pip install flask-socketio
pip install python-dotenv
pip install google-api-python-client
flask --app server run
```

# Frontend

## Prerequistes

- Node.js
- npm

## Installing dependencies

```bash
cd frontend
npm i --force
```

## Building

```bash
npm run build
```

## Development

```bash
npm run start
```
