import os

file_path = 'backend/app.py'

# Read existing content
with open(file_path, 'r') as f:
    lines = f.readlines()

# Keep lines up to get_waiting_list end (around line 538)
# We look for the end of get_waiting_list
cutoff_index = -1
for i, line in enumerate(lines):
    if "def get_waiting_list():" in line:
        # Find the end of this function
        for j in range(i, len(lines)):
            if "return jsonify({'success': False, 'message': str(e)}), 500" in lines[j]:
                cutoff_index = j + 1
                break
        break

if cutoff_index == -1:
    print("Could not find cutoff point. Aborting.")
    exit(1)

print(f"Truncating at line {cutoff_index}")
lines = lines[:cutoff_index]

# Append missing functions
new_code = """

@app.route('/api/waiting-list', methods=['POST'])
def add_to_waiting_list():
    try:
        data = request.get_json()
        required_fields = ['student_name', 'phone', 'join_date']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute(\"\"\"
            INSERT INTO waiting_list (name, phone, join_date)
            VALUES (?, ?, ?)
        \"\"\", (data['student_name'], data['phone'], data['join_date']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Added to waiting list successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/maintenance', methods=['GET'])
def get_maintenance_requests():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute(\"\"\"
            SELECT * FROM maintenance_requests 
            ORDER BY created_at DESC
        \"\"\")
        requests = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': [dict(req) for req in requests]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/maintenance', methods=['POST'])
def create_maintenance_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        from datetime import datetime
        cursor.execute(\"\"\"
            INSERT INTO maintenance_requests (student_id, room_id, category, description, priority, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'Pending', ?)
        \"\"\", (data.get('student_id'), data.get('room_id'), data.get('category'),
              data.get('description'), data.get('priority', 'Medium'), datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Maintenance request created successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/room-change-requests', methods=['GET'])
def get_room_change_requests():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
        
        cursor = conn.cursor()
        cursor.execute(\"\"\"
            SELECT rcr.*, s.name, s.email, r1.room_number as current_room_number, r2.room_number as requested_room_number
            FROM room_change_requests rcr
            JOIN students s ON rcr.student_id = s.student_id
            LEFT JOIN rooms r1 ON rcr.current_room = r1.room_id
            LEFT JOIN rooms r2 ON rcr.requested_room = r2.room_id
            WHERE rcr.status = 'Pending'
            ORDER BY rcr.request_date DESC
        \"\"\")
        
        requests = []
        for row in cursor.fetchall():
            requests.append({
                'request_id': row['request_id'],
                'student_id': row['student_id'],
                'student_name': row['name'],
                'student_email': row['email'],
                'current_room': row['current_room'],
                'current_room_number': row['current_room_number'],
                'requested_room': row['requested_room'],
                'requested_room_number': row['requested_room_number'],
                'reason': row['reason'],
                'status': row['status'],
                'request_date': row['request_date']
            })
        
        conn.close()
        return jsonify({'success': True, 'data': requests})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/room-change-requests', methods=['POST'])
def create_room_change_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
        
        cursor = conn.cursor()
        from datetime import datetime
        cursor.execute(\"\"\"
            INSERT INTO room_change_requests (student_id, current_room, requested_room, reason, status, request_date)
            VALUES (?, ?, ?, ?, 'Pending', ?)
        \"\"\", (data.get('student_id'), data.get('current_room'), data.get('requested_room'),
              data.get('reason'), datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Room change request submitted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/room-change-requests/<int:request_id>/approve', methods=['PUT'])
def approve_room_change_request(request_id):
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
        
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM room_change_requests WHERE request_id = ?", (request_id,))
        request_data = cursor.fetchone()
        
        if not request_data:
            conn.close()
            return jsonify({'success': False, 'message': 'Request not found'}), 404
        
        student_id = request_data['student_id']
        current_room = request_data['current_room']
        requested_room = request_data['requested_room']
        
        cursor.execute("UPDATE students SET room_id = ? WHERE student_id = ?", (requested_room, student_id))
        
        if current_room:
            cursor.execute("UPDATE rooms SET current_occupancy = current_occupancy - 1 WHERE room_id = ?", (current_room,))
        
        cursor.execute("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = ?", (requested_room,))
        
        cursor.execute("UPDATE room_change_requests SET status = 'Approved' WHERE request_id = ?", (request_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Room change request approved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/room-change-requests/<int:request_id>/deny', methods=['PUT'])
def deny_room_change_request(request_id):
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
        
        cursor = conn.cursor()
        cursor.execute("UPDATE room_change_requests SET status = 'Denied' WHERE request_id = ?", (request_id,))
        
        conn.commit()
        conn.close()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM announcements ORDER BY date DESC")
        announcements = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': announcements})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/rooms/<string:room_identifier>/details', methods=['GET'])
def get_room_details(room_identifier):
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Try to find room by ID or Number
        room = None
        if room_identifier.isdigit():
            cursor.execute("SELECT * FROM rooms WHERE room_id = ?", (int(room_identifier),))
            room = cursor.fetchone()
            
        if not room:
            cursor.execute("SELECT * FROM rooms WHERE room_number = ?", (room_identifier,))
            room = cursor.fetchone()
            
        if not room:
            conn.close()
            return jsonify({'success': False, 'message': 'Room not found'}), 404
            
        room_id = room['room_id']
        
        # Get students in room with full details
        cursor.execute(\"\"\"
            SELECT s.student_id, s.name, s.email, s.phone, s.branch, s.year_of_study, s.payment_status,
                   GROUP_CONCAT(m.category || ': ' || m.description || ' (' || m.status || ')') as maintenance_problems
            FROM students s
            LEFT JOIN maintenance_requests m ON s.student_id = m.student_id
            WHERE s.room_id = ?
            GROUP BY s.student_id
        \"\"\", (room_id,))
        students = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'success': True, 
            'data': {
                'room_number': room['room_number'],
                'capacity': room['capacity'], 
                'current_occupancy': room['current_occupancy'],
                'students': students
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/waiting-list/<int:waiting_id>/assign', methods=['POST'])
def assign_waiting_student(waiting_id):
    try:
        data = request.json
        room_identifier = data.get('room_id') # Can be ID or Number
        
        if not room_identifier:
            return jsonify({'success': False, 'message': 'Room Number/ID is required'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Find room
        room = None
        cursor.execute("SELECT * FROM rooms WHERE room_number = ?", (str(room_identifier),))
        room = cursor.fetchone()
        
        if not room and str(room_identifier).isdigit():
             cursor.execute("SELECT * FROM rooms WHERE room_id = ?", (int(room_identifier),))
             room = cursor.fetchone()
        
        if not room:
            conn.close()
            return jsonify({'success': False, 'message': 'Room not found'}), 404
            
        room_id = room['room_id']
        room = dict(room)
        
        if room['current_occupancy'] >= room['capacity']:
            conn.close()
            return jsonify({'success': False, 'message': 'Room is full'}), 400
            
        # Get waiting student details
        cursor.execute("SELECT * FROM waiting_list WHERE id = ?", (waiting_id,))
        waiting_student = cursor.fetchone()
        
        if not waiting_student:
            conn.close()
            return jsonify({'success': False, 'message': 'Waiting student not found'}), 404
            
        waiting_student = dict(waiting_student)
            
        # Create student account
        # Use 'name' instead of 'student_name'
        username = waiting_student['email'].split('@')[0] if waiting_student.get('email') else waiting_student['name'].lower().replace(' ', '')
        password = 'student123'  # Default password
        
        from datetime import datetime
        cursor.execute(\"\"\"
            INSERT INTO students (name, username, email, password, room_id, phone, branch, year_of_study, status, joined_date, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \"\"\", (waiting_student['name'], username, waiting_student.get('email', ''), password, 
               room_id, waiting_student['phone'], waiting_student.get('branch', ''), waiting_student.get('year_of_study', 1),
               'Active', datetime.now().strftime('%Y-%m-%d'), 'Pending'))
        
        # Update room occupancy
        cursor.execute("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = ?", (room_id,))
        
        # Update waiting list status
        cursor.execute("UPDATE waiting_list SET status = 'Assigned' WHERE id = ?", (waiting_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Student assigned successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/student/dashboard/<int:student_id>', methods=['GET'])
def get_student_dashboard(student_id):
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Get student info
        cursor.execute(\"\"\"
            SELECT s.name, s.email, s.room_id, r.room_number, s.branch, s.year_of_study,
                   (SELECT status FROM payments WHERE student_id = s.student_id ORDER BY deadline DESC LIMIT 1) as payment_status
            FROM students s
            LEFT JOIN rooms r ON s.room_id = r.room_id
            WHERE s.student_id = ?
        \"\"\", (student_id,))
        student = cursor.fetchone()
        
        if not student:
            conn.close()
            return jsonify({'success': False, 'message': 'Student not found'}), 404
            
        student = dict(student)
        
        # Get roommates
        roommates = []
        if student['room_id']:
            cursor.execute("SELECT name FROM students WHERE room_id = ? AND student_id != ?", (student['room_id'], student_id))
            roommates = [row['name'] for row in cursor.fetchall()]
            
        # Get maintenance problems
        cursor.execute(\"\"\"
            SELECT category, description, status, created_at, resolved_at 
            FROM maintenance_requests 
            WHERE student_id = ?
            ORDER BY created_at DESC
        \"\"\", (student_id,))
        maintenance_problems = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'student': student,
                'roommates': roommates,
                'maintenance_problems': maintenance_problems
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""

with open(file_path, 'w') as f:
    f.writelines(lines)
    f.write(new_code)

print("Restored app.py successfully.")
