# St. Luke Hospital HR Management System

A comprehensive HR management system for St. Luke Hospital built with React, Node.js, Express, and MySQL.

## Features

- **Staff Management** - Add, edit, view, and delete staff members
- **Department Management** - Manage hospital departments
- **Post Management** - Manage job positions/posts
- **Recruitment** - Track job applications
- **User Authentication** - Secure login with JWT

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Fl3u-ry/HRMS-.git
cd HRMS
```

2. **Setup Backend:**
```bash
cd backend
npm install
```

3. **Configure Database:**
Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=st_luke_hr
DB_PORT=3306
PORT=5000
```

4. **Setup Frontend:**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend:**
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:3000

### Default Admin Login
- **Username:** admin
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Staff
- `GET /api/employees` - Get all staff
- `GET /api/employees/:id` - Get staff by ID
- `POST /api/employees` - Create staff
- `PUT /api/employees/:id` - Update staff
- `DELETE /api/employees/:id` - Delete staff

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Posts
- `GET /api/positions` - Get all posts
- `GET /api/positions/:id` - Get post by ID
- `POST /api/positions` - Create post
- `PUT /api/positions/:id` - Update post
- `DELETE /api/positions/:id` - Delete post

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
HRMS/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── schema.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Department.js
│   │   ├── Employee.js
│   │   ├── Position.js
│   │   └── UserAccount.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── departments.js
│   │   ├── employees.js
│   │   ├── positions.js
│   │   └── users.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## License

MIT License
