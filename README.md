# Requirement-Management-System
A comprehensive full-stack web application designed to streamline the management of academic requirements. 
Built with Spring Boot 4x with role-based access control for students, administrators and frontend React 18v, it provides an intuitive interface for students to track their progress 
and for administrators to manage institutional requirements.

## Features
### 👨‍🎓 Student Features
- **Dashboard**: View personalized requirement status and progress
- **Requirement Tracking**: Browse and track academic requirements
- **Student Profile**: Manage personal information and academic details
- **Progress Monitoring**: Track completion status of requirements

### 👨‍💼 Admin Features
- **Admin Panel**: Centralized management interface
- **Student Management**: View and manage student records
- **Requirement Management**: Create, update, and manage academic requirements
- **User Administration**: Manage system users and roles

### 🔐 Security
- Role-based access control (RBAC)
- Secure authentication and authorization
- Protected routes for authorized users only
## 📦 Project Structure

```bash
RequirementManagementSystem
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── services
│   └── package.json
│
└── backend (Spring Boot)
    ├── src/main/java
    ├── src/main/resources
    ├── src/test
    └── pom.xml
```
## Tech Stack
### Backend
- **Framework**: Spring Boot 4
- **Language**: Java 21
- **Database**: MySQL
- **API**: RESTful architecture

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS
- **State Management**: Context API

## Frontend Setup
- **cd frontend**
- **npm install**
- **npm run dev**

Author
Mohanraj S


