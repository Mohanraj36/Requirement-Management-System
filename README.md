# Requirement-Management-System
A full-stack web application for managing academic requirements with role-based access control for students and administrators.

# Requirement Management System

A comprehensive full-stack web application designed to streamline the management of academic requirements. 
Built with Spring Boot and React, it provides an intuitive interface for students to track their progress 
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

## Tech Stack

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Database**: [Your Database - PostgreSQL/MySQL/etc.]
- **API**: RESTful architecture

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS
- **State Management**: Context API

## Project Structure
RequirementManagementSystem/
├── frontend/ # React + Vite application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components
│ │ ├── context/ # Context API for state
│ │ └── services/ # API integration
│ └── package.json
└── RequirementManagementSystem/ # Spring Boot backend
├── src/
│ ├── main/
│ │ ├── java/ # Java source code
│ │ └── resources/
│ └── test/
└── pom.xml
## Frontend Setup
cd frontend
npm install
npm run dev

Author
Mohanraj S


