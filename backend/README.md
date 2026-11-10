# JC Notes — Backend API Service

This backend service provides an optional, standalone REST API layer for the JC Notes Academic Platform.

## Architecture
- `src/controllers/`: Business logic for handling academic document requests.
- `src/routes/`: API endpoint definitions (`/api/notes`, `/api/laboratory`, `/api/syllabus`, `/api/pyq`, `/api/pdf`).
- `src/services/`: Content discovery and inventory lookup from the `content/` repository.
- `src/utils/`: Path resolution and file safety helpers.

## Running the Backend
```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Start in production mode
npm start
```
