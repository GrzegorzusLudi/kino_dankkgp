# Backend changes

Summary of changes to the Python backend located in `server/`. Listed newest first, oldest last. Dates are commit author dates.

## 2026-01-09 — Skip and remove videos from queue (`179e35a`)
- `server/classes/queue.py`, `server/classes/video.py`, `server/classes/voting.py`, `server/classes/appstate.py`: added support for skipping the current video and removing videos from the queue.
- `server/socketpaths.py`: new socket events wired to skip/remove actions.

## 2026-01-07 — Privacy fields on `Voting` (`32adf2b`)
- `server/classes/voting.py`: renamed the public `users_voted` field, splitting it into `you_voted` (whether the requesting user has voted) and `user_number_voted` (anonymous count) to avoid exposing the list of voters.
- Propagated the rename through `server/classes/appstate.py`, `server/classes/queue.py`, `server/classes/video.py` and `server/socketpaths.py`.

## 2026-01-04 — Vote-to-skip current video (`f673c61`)
- Added `server/classes/video.py` and `server/classes/voting.py` introducing the `Video` and `Voting` classes.
- `server/classes/queue.py`, `server/classes/appstate.py`: integrated voting state into the queue/app state.
- `server/socketpaths.py`: added socket handlers for casting a skip vote on the currently-playing video.

## 2025-12-15 — Load API key from `.env` (`f2ecb46`)
- `server/apikeytest.py`: replaced the hard-coded YouTube API key with `python-dotenv` based loading from a local `.env` file.

## 2025-03-17 — Simple queue added to the server (`c03748b`)
- `server/classes/queue.py`: filled in the `Queue` class with add/peek/pop semantics.
- `server/classes/appstate.py`, `server/classes/message.py`: wired the queue into application state and message handling.
- `server/server.py`, `server/socketpaths.py`, `server/apiconnection.py`: exposed queue operations over sockets and through the YouTube API connector.

## 2025-02-17 — `.env_example`, queue scaffolding, `classes/` package (`bb5fa8e`)
- Introduced the `server/classes/` package with initial modules: `appstate.py`, `message.py`, `queue.py`, `user.py`.
- Added `server/apiconnection.py` (YouTube Data API client) and `server/apikeytest.py` (standalone key check script).
- Added `server/.env_example` documenting required environment variables.
- Removed the old flat `server/stateutils.py`, migrating its responsibilities into the `classes/` modules.
- Touched `server/server.py`, `server/socketpaths.py` and `server/utils.py` to consume the new package layout.

## 2025-02-15 — Move API notes out of `server/` (`5c20900`)
- Removed `server/zarys-api.txt`; the API notes were relocated under the workspace `docs/` folder.

## 2025-02-15 — Configurable static and template folders (`c0fa7ae`)
- `server/server.py`: pointed Flask's `static_folder` and `template_folder` at the new shared locations.

## 2025-02-15 — Ignore `server/node_modules`, drop stale JS assets (`8f50c91`)
- Deleted leftover Node-era assets `server/static/socket.io.min.js` and `server/templates/index.html`.
- Added `.gitkeep` files so empty `server/static/` and `server/templates/` directories are tracked.
- Updated ignore rules so `server/node_modules`, `server/static/*` and `server/templates/*` are no longer committed.

## 2025-02-06 — Chat over sockets (`7fc47fb`)
- `server/socketpaths.py`: added chat message socket event handlers.
- `server/stateutils.py`: stored and broadcasted chat messages alongside existing app state.

## 2025-02-06 — Syntax fix (`fb63438`)
- `server/stateutils.py`: corrected a syntax error introduced in the previous commit.

## 2025-02-02 — Initial Python backend (`2adc303`)
- Replaced the previous Node.js/Express prototype with a Python implementation.
- Added `server/server.py` (Flask + Flask-SocketIO entry point), `server/socketpaths.py` (socket route registrations), `server/stateutils.py` (shared app state helpers), `server/utils.py` (utility helpers) and `server/testapp.py` (minimal test harness).
- Added initial `server/templates/index.html` and `server/static/socket.io.min.js` to serve a test page.
- Added `server/zarys-api.txt` with early API design notes.
- Deleted the Node.js prototype (`server/index.js`, `server/package-lock.json`, `server/node_modules/**`, `server/.gitignore`).

---

## Pre-Python history (for context)

The following commits predate the Python backend and are listed for completeness only.

- **2025-02-02** — `d5f2ca6` `gitignore`: tweak to `server/.gitignore`.
- **2025-02-02** — `7897a54` `gitignore test`: tweak to `server/.gitignore`.
- **2025-02-02** — `bc0d2ea` `gitignore`: added initial `server/.gitignore`.
- **2020-12-28** — `45f3b8e` `chat, but not working on sockets`: first commit, a Node.js/Express prototype (`server/index.js` + `server/node_modules/**`).
