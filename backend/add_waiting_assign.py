import sqlite3
import os
from datetime import datetime

DATABASE = os.path.join(os.path.dirname(__file__), 'hostel.db')

def add_waiting_assign_endpoint():
    # This will be added to app.py
    endpoint_code = '''
@app.route('/api/admin/waiting-list/<int:waiting_id>/assign', methods=['POST'])
def assign_waiting_student(waiting_id):
    try:
        data = request.json
        room_id = data.get('room_id')
        
        if not room_id:
            return jsonify({'success': False, 'message': 'Room ID is required'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Get waiting student details
        cursor.execute("SELECT * FROM waiting_list WHERE id = ?", (waiting_id,))
        waiting_student = cursor.fetchone()
        
        if not waiting_student:
            conn.close()
            return jsonify({'success': False, 'message': 'Waiting student not found'}), 404
            
        waiting_student = dict(waiting_student)
        
        # Check room availability
        cursor.execute("SELECT capacity, current_occupancy FROM rooms WHERE room_id = ?", (room_id,))
        room = cursor.fetchone()
        
        if not room:
            conn.close()
            return jsonify({'success': False, 'message': 'Room not found'}), 404
            
        room = dict(room)
        
        if room['current_occupancy'] >= room['capacity']:
            conn.close()
            return jsonify({'success': False, 'message': 'Room is full'}), 400
            
        # Create student account
        username = waiting_student['email'].split('@')[0] if waiting_student.get('email') else waiting_student['student_name'].lower().replace(' ', '')
        password = 'student123'  # Default password
        
        cursor.execute("""
            INSERT INTO students (name, username, email, password, room_id, phone, branch, year_of_study, status, joined_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (waiting_student['student_name'], username, waiting_student.get('email', ''), password, 
               room_id, waiting_student['phone'], waiting_student.get('branch', ''), waiting_student.get('year_of_study', 1),
               'Active', datetime.now().strftime('%Y-%m-%d')))
        
        # Update room occupancy
        cursor.execute("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = ?", (room_id,))
        
        # Update waiting list status
        cursor.execute("UPDATE waiting_list SET status = 'Assigned' WHERE id = ?", (waiting_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Student assigned successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
'''
    print("Add this endpoint to app.py:")
    print(endpoint_code)

if __name__ == "__main__":
    add_waiting_assign_endpoint()