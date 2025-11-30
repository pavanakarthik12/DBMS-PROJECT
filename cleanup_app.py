import os

file_path = 'backend/app.py'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Find the first get_announcements
start_index = -1
for i, line in enumerate(lines):
    if "def get_announcements():" in line:
        start_index = i
        break

if start_index != -1:
    print(f"Found get_announcements at {start_index}")
    
    # Find get_student_dashboard
    student_dashboard_index = -1
    for i in range(start_index, len(lines)):
        if "api/student/dashboard" in lines[i]:
            student_dashboard_index = i
            break
            
    if student_dashboard_index != -1:
        print(f"Found student_dashboard at {student_dashboard_index}")
        
        # Find conn.close() inside get_announcements
        conn_close_index = -1
        for i in range(start_index, start_index + 20):
            if "conn.close()" in lines[i]:
                conn_close_index = i
                break
        
        if conn_close_index != -1:
            print(f"Found conn.close() at {conn_close_index}")
            
            # New content for get_announcements return
            return_block = [
                "        \n",
                "        return jsonify({'success': True, 'data': announcements})\n",
                "    except Exception as e:\n",
                "        return jsonify({'success': False, 'message': str(e)}), 500\n",
                "\n"
            ]
            
            # Construct new lines
            # Keep everything up to conn.close()
            # Add return block
            # Skip everything until student_dashboard_index
            # Keep everything from student_dashboard_index
            
            new_lines = lines[:conn_close_index+1] + return_block + lines[student_dashboard_index:]
            
            with open(file_path, 'w') as f:
                f.writelines(new_lines)
            print("File cleaned up successfully.")
        else:
            print("Could not find conn.close() in get_announcements")
    else:
        print("Could not find get_student_dashboard")
else:
    print("Could not find get_announcements")
