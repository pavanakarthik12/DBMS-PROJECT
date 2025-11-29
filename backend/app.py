from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_connection
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Initialize database on startup
init_db()

def init_announcements_table():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                category TEXT NOT NULL,
                date TEXT NOT NULL
            )
        """)
        # Insert sample data if empty
        cursor.execute("SELECT COUNT(*) FROM announcements")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO announcements (title, message, category, date)
                VALUES 
                ('Welcome to the Hostel Management System', 'We are pleased to announce the launch of our new hostel management platform. Please explore all the features available.', 'General', ?),
                ('Maintenance Schedule', 'Regular maintenance will be conducted on all floors this weekend. Please cooperate with the maintenance team.', 'Maintenance', ?)
            """, (datetime.now().strftime('%Y-%m-%d'), (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')))
            conn.commit()
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Get statistics
        cursor.execute("SELECT COUNT(*) as total_rooms FROM rooms")
        total_rooms = cursor.fetchone()['total_rooms']
        
        cursor.execute("SELECT SUM(current_occupancy) as occupied FROM rooms")
        occupied = cursor.fetchone()['occupied'] or 0
        
        cursor.execute("SELECT SUM(capacity) as total_capacity FROM rooms")
        total_capacity = cursor.fetchone()['total_capacity']
        
        occupancy_rate = round((occupied / total_capacity * 100), 1) if total_capacity > 0 else 0
        
        cursor.execute("SELECT COUNT(*) as pending_payments FROM payments WHERE status = 'Unpaid'")
        pending_payments = cursor.fetchone()['pending_payments']
        
        cursor.execute("SELECT COUNT(*) as pending_complaints FROM complaints WHERE status = 'Pending'")
        pending_complaints = cursor.fetchone()['pending_complaints']
        
        cursor.execute("SELECT COUNT(*) as waiting_list FROM waiting_list")
        waiting_list = cursor.fetchone()['waiting_list']
        
        cursor.execute("SELECT COUNT(*) as total_students FROM students")
        total_students = cursor.fetchone()['total_students']
        
        # Check if maintenance_requests table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='maintenance_requests'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            cursor.execute("SELECT COUNT(*) as pending_maintenance FROM maintenance_requests WHERE status = 'Pending'")
            pending_maintenance = cursor.fetchone()['pending_maintenance']
        else:
            pending_maintenance = 0
        
        # Get today's menu
        today = datetime.now().strftime('%A')
        cursor.execute("SELECT * FROM menu WHERE day = ?", (today,))
        today_menu = cursor.fetchone()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'total_rooms': total_rooms,
                'total_students': total_students,
                'occupancy_rate': occupancy_rate,
                'pending_payments': pending_payments,
                'pending_complaints': pending_complaints,
                'pending_maintenance': pending_maintenance,
                'waiting_list': waiting_list,
                'today_menu': dict(today_menu) if today_menu else None
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/student/dashboard/<int:student_id>', methods=['GET'])
def student_dashboard(student_id):
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        # Get student info with room details
        cursor.execute("""
            SELECT s.*, r.room_number, r.capacity
            FROM students s
            LEFT JOIN rooms r ON s.room_id = r.room_id
            WHERE s.student_id = ?
        """, (student_id,))
        student = cursor.fetchone()
        
        if not student:
            conn.close()
            return jsonify({'success': False, 'message': 'Student not found'}), 404
        
        # Get roommates
        roommates = []
        if student['room_id']:
            cursor.execute("""
                SELECT name FROM students 
                WHERE room_id = ? AND student_id != ?
            """, (student['room_id'], student_id))
            roommates = [row['name'] for row in cursor.fetchall()]
        
        # Get payment status
        cursor.execute("""
            SELECT * FROM payments 
            WHERE student_id = ? 
            ORDER BY deadline DESC LIMIT 1
        """, (student_id,))
        payment = cursor.fetchone()
        
        # Get today's menu
        today = datetime.now().strftime('%A')
        cursor.execute("SELECT * FROM menu WHERE day = ?", (today,))
        today_menu = cursor.fetchone()
        
        # Get recent complaints
        cursor.execute("""
            SELECT * FROM complaints 
            WHERE student_id = ? 
            ORDER BY raised_date DESC LIMIT 5
        """, (student_id,))
        complaints = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'student': dict(student),
                'roommates': roommates,
                'payment': dict(payment) if payment else None,
                'today_menu': dict(today_menu) if today_menu else None,
                'recent_complaints': complaints
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, 
                   GROUP_CONCAT(s.name) as students
            FROM rooms r
            LEFT JOIN students s ON r.room_id = s.room_id
            GROUP BY r.room_id
            ORDER BY r.room_number
        """)
        rooms = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': rooms})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/payments', methods=['GET'])
def get_payments():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, s.name, s.email, r.room_number
            FROM payments p
            JOIN students s ON p.student_id = s.student_id
            LEFT JOIN rooms r ON s.room_id = r.room_id
            ORDER BY p.deadline ASC
        """)
        payments = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': payments})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/payments/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    try:
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({'success': False, 'message': 'Missing status'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        payment_date = datetime.now().strftime('%Y-%m-%d') if data['status'] == 'Paid' else None
        
        cursor.execute("""
            UPDATE payments 
            SET status = ?, payment_date = ? 
            WHERE payment_id = ?
        """, (data['status'], payment_date, payment_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Payment updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    try:
        student_id = request.args.get('student_id')
        
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        
        if student_id:
            cursor.execute("""
                SELECT c.*, s.name, r.room_number
                FROM complaints c
                JOIN students s ON c.student_id = s.student_id
                LEFT JOIN rooms r ON c.room_id = r.room_id
                WHERE c.student_id = ?
                ORDER BY c.raised_date DESC
            """, (student_id,))
        else:
            cursor.execute("""
                SELECT c.*, s.name, r.room_number
                FROM complaints c
                JOIN students s ON c.student_id = s.student_id
                LEFT JOIN rooms r ON c.room_id = r.room_id
                ORDER BY c.raised_date DESC
            """)
        
        complaints = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': complaints})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    try:
        data = request.get_json()
        required_fields = ['student_id', 'room_id', 'complaint_type', 'description']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO complaints (student_id, room_id, complaint_type, description, raised_date)
            VALUES (?, ?, ?, ?, ?)
        """, (data['student_id'], data['room_id'], data['complaint_type'], 
              data['description'], datetime.now().strftime('%Y-%m-%d')))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Complaint raised successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/complaints/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    try:
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({'success': False, 'message': 'Missing status'}), 400
            
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("UPDATE complaints SET status = ? WHERE complaint_id = ?", 
                      (data['status'], complaint_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Complaint updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/menu', methods=['GET'])
def get_menu():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM menu ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END")
        menu = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': menu})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/waiting-list', methods=['GET'])
def get_waiting_list():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM waiting_list ORDER BY join_date ASC")
        waiting_list = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': waiting_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

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
        cursor.execute("""
            INSERT INTO waiting_list (student_name, phone, join_date)
            VALUES (?, ?, ?)
        """, (data['student_name'], data['phone'], data['join_date']))
        
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
        cursor.execute("""
            SELECT * FROM maintenance_requests 
            ORDER BY created_at DESC
        """)
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
        cursor.execute("""
            INSERT INTO maintenance_requests (student_id, room_id, category, description, priority, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'Pending', ?)
        """, (data.get('student_id'), data.get('room_id'), data.get('category'),
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

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM announcements ORDER BY date DESC")
        announcements = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': announcements})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)