import gspread
from google.oauth2.service_account import Credentials
import os
from typing import List, Dict, Any, Optional, Tuple

class SheetsClient:
    """
    A client to interact with the Google Sheet that acts as the application's database.
    """
    
    # IMPORTANT: Replace this with the ID of your Google Sheet.
    # You can find this in the URL of your sheet:
    # https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
    SHEET_ID = "YOUR_SHEET_ID_HERE"
    
    # Path to the service account credentials file.
    CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')
    
    # Scopes required to access Google Sheets and Drive.
    SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file"
    ]

    def __init__(self):
        """
        Initializes the client, authenticates with Google, and opens the workbook.
        """
        if self.SHEET_ID == "YOUR_SHEET_ID_HERE":
            raise ValueError("Google Sheet ID is not set in sheets_client.py. Please update it.")
            
        if not os.path.exists(self.CREDENTIALS_FILE):
             raise FileNotFoundError(
                f"Service account credentials not found at {self.CREDENTIALS_FILE}. "
                "Please follow the setup instructions in README.md."
             )
        
        creds = Credentials.from_service_account_file(self.CREDENTIALS_FILE, scopes=self.SCOPES)
        self.client = gspread.authorize(creds)
        self.workbook = self.client.open_by_key(self.SHEET_ID)

    def get_worksheet(self, sheet_name: str) -> gspread.Worksheet:
        """
        Gets a specific worksheet by name.
        """
        try:
            return self.workbook.worksheet(sheet_name)
        except gspread.exceptions.WorksheetNotFound:
            raise ValueError(f"Worksheet '{sheet_name}' not found in the Google Sheet.")

    def get_all_records(self, sheet_name: str) -> List[Dict[str, Any]]:
        """
        Fetches all rows from a sheet and returns them as a list of dictionaries.
        """
        sheet = self.get_worksheet(sheet_name)
        return sheet.get_all_records()

    def find_record(self, sheet_name: str, column: str, value: Any) -> Optional[Dict[str, Any]]:
        """
        Finds the first row where the given column matches the value.
        """
        records = self.get_all_records(sheet_name)
        return next((record for record in records if str(record.get(column)) == str(value)), None)

    def find_row_and_data(self, sheet_name: str, column_header: str, value: Any) -> Optional[Tuple[int, Dict[str, Any]]]:
        """
        Finds a row by a specific column value and returns its row number and data.
        """
        sheet = self.get_worksheet(sheet_name)
        headers = sheet.row_values(1)
        
        try:
            col_index = headers.index(column_header) + 1
        except ValueError:
            raise ValueError(f"Column '{column_header}' not found in sheet '{sheet_name}'.")

        try:
            cell = sheet.find(str(value), in_column=col_index)
            if cell:
                row_data = sheet.row_values(cell.row)
                data_dict = {header: val for header, val in zip(headers, row_data)}
                return cell.row, data_dict
        except gspread.exceptions.CellNotFound:
            return None
        return None


    def append_row(self, sheet_name: str, values: List[Any]):
        """
        Appends a new row to the specified sheet.
        """
        sheet = self.get_worksheet(sheet_name)
        sheet.append_row(values)

    def update_cell(self, sheet_name: str, row: int, col: int, value: Any):
        """
        Updates a specific cell in the sheet.
        """
        sheet = self.get_worksheet(sheet_name)
        sheet.update_cell(row, col, value)

