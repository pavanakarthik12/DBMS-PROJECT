#!/bin/bash
echo "Starting Hostel Management System..."
echo

echo "Installing backend dependencies..."
cd backend
pip install flask flask-cors
echo

echo "Starting Flask backend server..."
python app.py &
BACKEND_PID=$!
echo "Backend started on http://localhost:5000 (PID: $BACKEND_PID)"
echo

cd ../frontend
echo "Installing frontend dependencies..."
npm install
echo

echo "Starting React frontend server..."
npm start &
FRONTEND_PID=$!
echo "Frontend will start on http://localhost:3000 (PID: $FRONTEND_PID)"
echo

echo "Both servers are running..."
echo
echo "Demo Credentials:"
echo "Admin - Username: admin, Password: admin123"
echo "Student - Email: rajesh@email.com, Password: student123"
echo
echo "Press Ctrl+C to stop all servers..."

# Wait for interrupt
trap 'kill $BACKEND_PID $FRONTEND_PID; echo "Servers stopped."; exit' INT
wait