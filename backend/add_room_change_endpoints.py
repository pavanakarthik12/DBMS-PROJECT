# Script to safely add room change endpoints to app.py
import re

# Read the current app.py
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Room change endpoints to add
room_change_endpoints = '''
@app.route('/api/room-change-requests', methods=['GET'])
def get_room_change_requests():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT rcr.*, s.name, s.email, r1.room_number as current_room_number, r2.room_number as requested_room_number
            FROM room_change_requests rcr
            JOIN students s ON rcr.student_id = s.student_id
            LEFT JOIN rooms r1 ON rcr.current_room = r1.room_id
            LEFT JOIN rooms r2 ON rcr.requested_room = r2.room_id
            WHERE rcr.status = 'Pending'
            ORDER BY rcr.request_date DESC
        """)
        
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
        cursor.execute("""
            INSERT INTO room_change_requests (student_id, current_room, requested_room, reason, status, request_date)
            VALUES (?, ?, ?, ?, 'Pending', ?)
        """, (data.get('student_id'), data.get('current_room'), data.get('requested_room'),
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
        
        return jsonify({'success': True, 'message': 'Room change request denied'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

'''

# Find the if __name__ == '__main__': block and insert before it
if_main_pattern = r"if __name__ == '__main__':"
match = re.search(if_main_pattern, content)

if match:
    insert_pos = match.start()
    new_content = content[:insert_pos] + room_change_endpoints + '\n' + content[insert_pos:]
    
    # Write the updated content
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Successfully added room change endpoints to app.py")
    print(f"✓ Added 4 new endpoints before line {content[:insert_pos].count(chr(10)) + 1}")
else:
    print("✗ Could not find if __name__ == '__main__': block")
