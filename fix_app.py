import os

file_path = 'backend/app.py'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Find the line with "'success': True," inside get_room_details
start_index = -1
for i, line in enumerate(lines):
    if "def get_room_details(room_id):" in line:
        # Search forward for the broken block
        for j in range(i, min(i + 50, len(lines))):
            if "'success': True," in lines[j] and lines[j].strip().startswith("'success':"):
                start_index = j
                break
        if start_index != -1:
            break

if start_index != -1:
    print(f"Found start line at index {start_index}: {lines[start_index]}")
    
    # We want to replace from start_index to the closing })
    end_index = -1
    for j in range(start_index, len(lines)):
        if "})" in lines[j] and lines[j].strip() == "})":
            end_index = j
            break
            
    if end_index != -1:
        print(f"Found end line at index {end_index}: {lines[end_index]}")
        
        new_content = [
            "        # Get students in room\n",
            "        cursor.execute(\"\"\"\n",
            "            SELECT s.student_id, s.name, s.email, s.phone, s.branch, s.year_of_study,\n",
            "                   GROUP_CONCAT(m.category || ': ' || m.description || ' (' || m.status || ')') as maintenance_problems,\n",
            "                   (SELECT status FROM payments WHERE student_id = s.student_id ORDER BY deadline DESC LIMIT 1) as payment_status\n",
            "            FROM students s\n",
            "            LEFT JOIN maintenance_requests m ON s.student_id = m.student_id\n",
            "            WHERE s.room_id = ?\n",
            "            GROUP BY s.student_id\n",
            "        \"\"\", (room_id,))\n",
            "        students = [dict(row) for row in cursor.fetchall()]\n",
            "        \n",
            "        conn.close()\n",
            "        \n",
            "        return jsonify({\n",
            "            'success': True, \n",
            "            'data': {\n",
            "                'room_number': room['room_number'],\n",
            "                'capacity': room['capacity'], \n",
            "                'current_occupancy': room['current_occupancy'],\n",
            "                'students': students\n",
            "            }\n",
            "        })\n"
        ]
        
        # Replace the lines
        lines[start_index:end_index+1] = new_content
        
        with open(file_path, 'w') as f:
            f.writelines(lines)
        print("File updated successfully.")
    else:
        print("Could not find end line '})'")
else:
    print("Could not find start line")
