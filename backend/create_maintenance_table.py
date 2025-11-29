import sqlite3
import sys

# Connect to database
conn = sqlite3.connect('hostel_management.db')
cursor = conn.cursor()

# Create maintenance_requests table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    room_id INTEGER,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    created_at TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
)
''')

conn.commit()
print("✓ Created maintenance_requests table successfully")

# Check if table was created
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='maintenance_requests'")
if cursor.fetchone():
    print("✓ Table exists and is ready to use")
else:
    print("✗ Failed to create table")
    sys.exit(1)

conn.close()
print("\n✓ Database setup complete!")
