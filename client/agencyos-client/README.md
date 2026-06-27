# AgencyOS — Agency Management Platform
AgencyOS is a full-stack agency management platform that helps teams manage clients, projects, and tasks from a single workspace. It features secure authentication, responsive dashboards, and complete CRUD functionality powered by a Node.js, Express, and MongoDB backend.

<img width="1920" height="918" alt="AgencyOS" src="https://github.com/user-attachments/assets/02198a3e-2f00-43ab-9c65-8b8744773900" />

## Live Demo

https://agencyos-saas.vercel.app/login

## Features

* Responsive dashboard layout
* JWT authentication and protected routes
* Client management
* Project management
* Task management
* Client activity tracking
* User settings
* Sidebar navigation
* Modern dashboard UI
* Mobile-friendly design

## Tech Stack

Angular • TypeScript • RxJS • SCSS • Node.js • Express • MongoDB • Mongoose • JWT Authentication • REST APIs • Git • Render

## What I Practiced

* Building a full-stack Angular application
* Creating reusable standalone Angular components
* Working with Angular Router and route guards
* Managing application state with RxJS
* Building RESTful APIs with Express
* Implementing JWT authentication and protected routes
* Designing MongoDB schemas with Mongoose
* Creating complete CRUD functionality
* Structuring a scalable full-stack application
* Building responsive dashboard layouts
  
## Screenshots
<img width="1920" height="1098" alt="image" src="https://github.com/user-attachments/assets/af3c58eb-6c17-475a-ad11-24151ff7497d" />

### Clients

<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/7c2789b3-b955-4377-bd0e-674d0c9e2303" />

### Projects

<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/ea43691a-c57f-45d8-bc65-fe850043fb4a" />


### Tasks

<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/7a131619-7bb7-4e1b-9fc4-64f9db6f47dc" />


### Mobile View

<img width="267" height="646" alt="image" src="https://github.com/user-attachments/assets/8167db4e-1120-45ee-9f85-ba1ba11e66c2" />

## Getting Started

### Prerequisites

* Node.js 18+
* npm
* MongoDB

### Installation

Clone the repository:

```bash
git clone https://github.com/Alvarez-J1/AgencyOS.git
```

Go into the project folder:

```bash
cd AgencyOS
```

Install frontend dependencies:

```bash
cd client/agencyos-client
npm install
```

Install backend dependencies:

```bash
cd ../../server
npm install
```

Create a `.env` file inside the `server` folder and add your MongoDB connection string and JWT secret.

Start the backend:

```bash
npm run dev
```

Start the Angular frontend:

```bash
cd ../client/agencyos-client
ng serve
```

Open:

```
http://localhost:4200
```

---

## Project Structure

```
agencyos/
├─ package.json                  # Root scripts
├─ .gitignore
│
├─ client/
│  └─ agencyos-client/           # Angular frontend
│     ├─ angular.json
│     ├─ package.json
│     ├─ tsconfig*.json
│     ├─ public/
│     │  ├─ agencyos-logo.png
│     │  ├─ agencyos-icon.png
│     │  └─ favicon.ico
│     │
│     └─ src/
│        ├─ environments/
│        └─ app/
│           ├─ layout/           # Shared application layout
│           ├─ models/           # TypeScript interfaces/models
│           ├─ pages/            # Application pages
│           └─ services/         # API services, authentication, guards
│
└─ server/
   ├─ package.json
   ├─ .env.example
   ├─ scripts/
   └─ src/
      ├─ config/                 # Database, JWT, indexes, rate limiting
      ├─ controllers/            # Request handlers
      ├─ middleware/             # Authentication middleware
      ├─ models/                 # Mongoose schemas
      ├─ routes/                 # Express API routes
      ├─ utils/                  # Helper utilities
      └─ server.js
```
---

## Author

Joel Alvarez

