@echo off
echo Starting Hostel Management System...
echo.

echo Installing backend dependencies...
cd backend
pip install flask flask-cors
echo.

echo Starting Flask backend server...
start /B python app.py
echo Backend started on http://localhost:5000
echo.

cd ..\frontend
echo Installing frontend dependencies...
npm install
echo.

echo Starting React frontend server...
start /B npm start
echo Frontend will start on http://localhost:3000
echo.

echo Both servers are starting...
echo.
echo Demo Credentials:
echo Admin - Username: admin, Password: admin123
echo Student - Email: rajesh@email.com, Password: student123
echo.
echo Press any key to exit...
pause >nul