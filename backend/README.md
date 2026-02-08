# Athena Backend (FastAPI with Google Sheets)

This backend uses Google Sheets as a lightweight, real-time database, which is ideal for prototypes and simple applications where data needs to be easily viewed and manipulated.

## 1. One-Time Setup

Before running, you **must** connect the backend to your own Google Sheet.

### Step 1: Get Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2. Search for and **enable** the **Google Sheets API** and **Google Drive API**.
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials > Service Account**.
5. Give it a name (e.g., "athena-backend") and grant it the **Editor** role.
6. After creation, find the service account, go to the **Keys** tab, click **Add Key > Create new key**, and select **JSON**.
7. A `credentials.json` file will be downloaded. **Place this file inside this `backend/` directory.**

### Step 2: Create and Configure Google Sheet
1. Create a new Google Sheet.
2. From the sheet's URL (e.g., `.../spreadsheets/d/SHEET_ID_IS_HERE/edit`), copy the **Sheet ID**.
3. Open `sheets_client.py` and replace `YOUR_SHEET_ID_HERE` with your Sheet ID.
4. Create four tabs at the bottom named exactly: `Users`, `Sessions`, `Attendance`, `Posts`.
5. Add the required column headers to the first row of each sheet as specified in the main project documentation.
6. Add some sample data to get started. Use ISO 8601 format for dates (e.g., `2024-10-28T10:00:00`).

### Step 3: Share the Sheet
1. Open `credentials.json` and copy the `client_email` address.
2. In your Google Sheet, click **Share**.
3. Paste the client email and give it **Editor** access.

## 2. Installation
Install the required Python packages:
```bash
pip install -r requirements.txt
```

## 3. Running the Server
Run the FastAPI server with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will now be running and connected to your Google Sheet. The API documentation is available at `http://127.0.0.1:8000/docs`.
