# SmartCare Medical Clinic Appointment Management System

## 1. Running the Interactive System

> **Note**: You cannot run this application by double-clicking `index.html` directly in your file explorer. Modern JavaScript module applications require a local development server.

### Prerequisites:
- [Node.js](https://nodejs.org/) (version 18 or higher)

### Steps to Run:
1. Open a terminal (Command Prompt, PowerShell, or macOS Terminal) inside the extracted project root folder.
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Launch the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 2. Running the Python / Flask Backend Package (`/SmartCare/`)

If you are running the project using Python for grading or testing the Flask/Jinja2 implementation:

### Prerequisites:
- Python 3.9+
- ODBC Driver 17 or 18 for SQL Server (or use the built-in local SQLite fallback)

### Steps to Run:
1. Open your terminal and change into the `SmartCare` directory:
   ```bash
   cd SmartCare
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS / Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
5. Open your browser at:
   ```
   http://127.0.0.1:5000
   ```

---

## 3. Running the Automated Unit Test Suite

To execute the unit tests (`UT01` to `UT07`):
```bash
cd SmartCare
python -m unittest test_suite.py -v
```