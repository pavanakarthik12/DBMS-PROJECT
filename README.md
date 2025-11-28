# Hostel Management System

A complete web application for managing hostel operations with React frontend and Flask backend.

## Project Structure

```
DBMS/
├── backend/
│   ├── app.py              # Flask application
│   ├── database.py         # Database setup and connection
│   ├── requirements.txt    # Python dependencies
│   └── hostel_management.db # SQLite database (auto-created)
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AuthContext.js
    │   │   └── Layout.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── AdminDashboard.js
    │   │   ├── StudentDashboard.js
    │   │   ├── RoomStatus.js
    │   │   ├── Payments.js
    │   │   ├── Complaints.js
    │   │   ├── Menu.js
    │   │   └── WaitingList.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── package.json
    └── node_modules/
```

## Features

### Admin Features
- Dashboard with statistics
- Room management and occupancy tracking
- Payment management (mark paid/unpaid)
- Complaint resolution
- Waiting list management
- Food menu viewing

### Student Features
- Personal dashboard
- Room and roommate information
- Payment status tracking
- Complaint raising and tracking
- Food menu viewing

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install flask flask-cors
```

3. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000` and automatically:
- Create the SQLite database if it doesn't exist
- Create all required tables
- Insert sample data if tables are empty

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Demo Credentials

### Admin Login
- Username: `admin`
- Password: `admin123`

### Student Login
- Email: `rajesh@email.com`
- Password: `student123`

Other student emails: `priya@email.com`, `amit@email.com`, etc. (all with password `student123`)

## Database Schema

### Tables
1. **students** - Student information and room assignments
2. **rooms** - Room details and capacity
3. **complaints** - Student complaints and resolution status
4. **payments** - Payment records and deadlines
5. **menu** - Weekly food menu
6. **waiting_list** - Students waiting for accommodation
7. **admins** - Admin user credentials

## Technology Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- CSS3 with responsive design
- Context API for state management

### Backend
- Python Flask
- SQLite database
- Flask-CORS for cross-origin requests
- Auto-initialization with sample data

## Features Implemented

✅ Complete authentication system
✅ Role-based access control (Admin/Student)
✅ Responsive design for mobile and desktop
✅ Real-time data updates
✅ Auto-database initialization
✅ CRUD operations for all entities
✅ Error handling and validation
✅ Professional UI with smooth transitions
✅ Sample data generation
✅ RESTful API design

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/payments` - All payments
- `PUT /api/payments/:id` - Update payment status
- `GET /api/complaints` - All complaints
- `PUT /api/complaints/:id` - Update complaint status

### Student Routes
- `GET /api/student/dashboard/:id` - Student dashboard
- `GET /api/complaints?student_id=:id` - Student complaints
- `POST /api/complaints` - Create new complaint

### General Routes
- `GET /api/rooms` - Room status
- `GET /api/menu` - Food menu
- `GET /api/waiting-list` - Waiting list
- `POST /api/waiting-list` - Add to waiting list

## Running in Production

1. Build the React app:
```bash
cd frontend && npm run build
```

2. Serve the built files with Flask or a web server
3. Update API base URL in production environment

The application is fully functional and production-ready with comprehensive error handling and data validation.