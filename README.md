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

Remember that before running server you should build UI first. Look at Frontend section to know how to do that.
After successfully running server you should be able to access it at You should be able to access server at http://127.0.0.1:5000/

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

Following command will build production version of the UI and then copy files to directories in the `server` directory:

```bash
npm run build
```

## Development

If you want to develop UI, run:

```bash
npm run start
```
