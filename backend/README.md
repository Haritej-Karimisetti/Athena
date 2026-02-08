# Athena Backend (FastAPI)

## Setup
1. Install Python 3.9+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running
Run the server with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Features
- **Auto-Seeding**: On first startup, the `athena.db` SQLite file is created and populated with a student (MOCK_STUDENT_123), courses, and today's timetable.
- **API Documentation**: Visit `http://127.0.0.1:8000/docs` to see the Swagger UI.

## Android Connection
Ensure your Android emulator can reach the host.
- If running locally: Use `http://10.0.2.2:8000/` as the Base URL in Retrofit.
