# EduLynx Demo Credentials & Access Guide

## 🔐 Demo User Credentials

All demo users have been successfully created and tested. Use these credentials
to login to the EduLynx system:

### Administrator Access

- **Email:** `admin@lynxacademy.co.za`
- **Password:** `adminpass`
- **Role:** ADMIN
- **Dashboard:** `/admin`

### Teacher Access

- **Email:** `teacher1@lynxacademy.co.za`
- **Password:** `teacherpass`
- **Role:** TEACHER
- **Dashboard:** `/teacher`

### Parent Access

- **Email:** `parent1@lynxacademy.co.za`
- **Password:** `parentpass`
- **Role:** PARENT
- **Dashboard:** `/parent`

### Student Access

- **Email:** `student1@lynxacademy.co.za`
- **Password:** `studentpass`
- **Role:** STUDENT
- **Dashboard:** `/student`

## 🚀 How to Test

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Application

- **Sign-in Page:** <http://localhost:3000/sign-in>
- **Home Page:** <http://localhost:3000>

### 3. Login Process

1. Navigate to <http://localhost:3000/sign-in>
2. Enter any of the demo credentials above
3. Click "Sign In"
4. You will be automatically redirected to the appropriate dashboard based on
   your role

### 4. Direct Dashboard Access

Once logged in, you can access dashboards directly:

- **Admin Dashboard:** <http://localhost:3000/admin>
- **Teacher Dashboard:** <http://localhost:3000/teacher>
- **Parent Dashboard:** <http://localhost:3000/parent>
- **Student Dashboard:** <http://localhost:3000/student>

## 🧪 API Testing

### Login API Test

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lynxacademy.co.za","password":"adminpass"}'
```

### Dashboard API Test (Admin)

```bash
# First login and save token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lynxacademy.co.za","password":"adminpass"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Then access dashboard API
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/dashboard/admin
```

## ✅ Verification Status

All demo credentials have been tested and verified:

- ✅ **Admin Login:** Working - Redirects to `/admin`
- ✅ **Teacher Login:** Working - Redirects to `/teacher`
- ✅ **Parent Login:** Working - Redirects to `/parent`
- ✅ **Student Login:** Working - Redirects to `/student`

### Test Results (Last Run: June 20, 2025)

```console
🧪 Testing demo user login credentials...

✅ ADMIN login successful: admin@lynxacademy.co.za
✅ TEACHER login successful: teacher1@lynxacademy.co.za
✅ PARENT login successful: parent1@lynxacademy.co.za
✅ STUDENT login successful: student1@lynxacademy.co.za

🎉 All demo users can login successfully!
```

## 🏫 School Context

All demo users are associated with:

- **School:** Lynx Academy
- **School ID:** 2
- **Location:** South Africa

## 📚 Database Content

The system has been seeded with comprehensive South African school data
including:

- **Students:** 100+ realistic student profiles
- **Teachers:** Multiple teacher profiles with subjects
- **Classes:** Various grade levels and subjects
- **Attendance:** Historical attendance records
- **Results:** Academic performance data
- **Medical Records:** Health information for students
- **Finance:** Income and expense records
- **Announcements:** School announcements
- **Events:** Academic and extracurricular events

## 🔧 Technical Details

- **Authentication:** JWT-based with HTTP-only cookies
- **Session Duration:** 7 days
- **Password Hashing:** bcrypt with 12 rounds
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** Next.js 14 with TypeScript
- **UI Framework:** Tailwind CSS + shadcn/ui

## 🎯 Next Steps

1. Login with any demo credentials
2. Explore the role-specific dashboards
3. Test the various features and modules
4. Check data visualization with charts and metrics
5. Navigate between different sections of the application

---

**Note:** These are demo credentials for testing purposes. In production, ensure
to change all default passwords and implement proper user management.
