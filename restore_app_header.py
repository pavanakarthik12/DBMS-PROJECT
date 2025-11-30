import os

file_path = 'backend/app.py'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Find where the code starts looking like login function body
start_index = -1
for i, line in enumerate(lines):
    if "data = request.get_json()" in line:
        # Check if previous line is try:
        if i > 0 and "try:" in lines[i-1]:
            start_index = i - 1
            break

if start_index != -1:
    print(f"Found login body start at {start_index}")
    
    header = [
        "from flask import Flask, request, jsonify\n",
        "from flask_cors import CORS\n",
        "from database import init_db, get_connection\n",
        "import sqlite3\n",
        "import os\n",
        "from datetime import datetime, timedelta\n",
        "\n",
        "app = Flask(__name__)\n",
        "CORS(app)\n",
        "\n",
        "# Initialize database on startup\n",
        "from database import DATABASE\n",
        "try:\n",
        "    print(f\"DEBUG: Using DATABASE at {os.path.abspath(DATABASE)}\")\n",
        "except:\n",
        "    pass\n",
        "init_db()\n",
        "\n",
        "\n",
        "@app.route('/api/login', methods=['POST'])\n",
        "def login():\n"
    ]
    
    # Replace everything before start_index with header
    new_lines = header + lines[start_index:]
    
    with open(file_path, 'w') as f:
        f.writelines(new_lines)
    print("Header restored.")
else:
    print("Could not find login body.")
