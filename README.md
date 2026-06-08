# Kino DANKKGP

# Backend

## Create env file

In `server` directory create `.env` file:

```bash
GOOGLE_API_KEY="<YOUR_API_KEY_HERE>"
STATIC_FOLDER="/static"
TEMPLATES_FOLDER="/templates"
```

## Running server

Remember that before running server you should build UI first. Look at Frontend section to learn how to do that.
After successfully running server you should be able to access app at http://127.0.0.1:5000/

### Linux

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

### Windows

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

```
cd server
python3 -m venv .venv
cd .venv/Scripts
activate.bat
cd ../../
flask --app server run

```

# Frontend

## Prerequisites

- Node.js - recommended v24.10.0
- npm - recommended v11.6.1

## Installing dependencies

```bash
cd frontend
npm install
```

## Tasks

All frontend tasks are run via [Nx](https://nx.dev) from the `frontend` directory.

### Build

Builds the production bundle and copies the output files into the `server` directory:

```bash
npx nx run browser:build
```

### Serve

Starts the Angular development server with live reload:

```bash
npx nx run browser:serve
```

### Test

Runs unit tests with Vitest:

```bash
npx nx run browser:test
```

### Lint

Lints the source files:

```bash
npx nx run browser:lint
```
