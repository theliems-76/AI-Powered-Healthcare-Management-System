<p align="center">
  <h1 align="center">🩺 AI-Powered Diabetes Risk Assessment & Management Platform</h1>
  <p align="center">
    A full-stack healthcare application that leverages Machine Learning and Large Language Models to predict Type 2 Diabetes risk and generate personalized nutrition & exercise plans.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/MySQL-Sequelize-4479A1?logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white" alt="Gemini"/>
  <img src="https://img.shields.io/badge/ML-CatBoost%20+%20SHAP-FF6F00" alt="CatBoost"/>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

---

## Overview

This platform is designed to assist patients and healthcare professionals in **early detection and ongoing management of Type 2 Diabetes**. It integrates:

- A **CatBoost ML model** trained on clinical data to predict diabetes risk from 21 health indicators.
- **SHAP (SHapley Additive exPlanations)** for transparent, explainable AI diagnostics.
- **Google Gemini 2.5 Flash** LLM to generate personalized medical assessments, diabetic-friendly meal plans, and exercise routines.
- A comprehensive **nutrition & exercise tracking system** with medical-grade calorie calculations (Mifflin-St Jeor TDEE).

---

## Architecture

The system follows a **3-tier microservices architecture**:

```
┌──────────────────┐     HTTP/JWT      ┌──────────────────┐     HTTP      ┌──────────────────┐
│                  │ ◄───────────────► │                  │ ◄──────────► │                  │
│   Frontend App   │                   │   Main Backend   │              │    AI Service    │
│   (React/Vite)   │                   │  (Node/Express)  │              │    (FastAPI)     │
│                  │                   │                  │              │                  │
│  • Dashboard     │                   │  • REST API      │              │  • CatBoost ML   │
│  • Assessment    │                   │  • JWT Auth      │              │  • SHAP Explain  │
│  • Meals Tracker │                   │  • RBAC          │              │  • Gemini LLM    │
│  • Exercise Log  │                   │  • Sequelize ORM │              │  • Nutrition AI  │
│  • Health History│                   │                  │              │                  │
└──────────────────┘                   └────────┬─────────┘              └──────────────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │                  │
                                       │      MySQL       │
                                       │    Database      │
                                       │                  │
                                       └──────────────────┘
```

---

## Key Features

### 🤖 AI-Powered Health Assessment
- Input 21 clinical health indicators (BMI, glucose levels, physical activity, etc.)
- Receive real-time diabetes risk prediction with confidence scores
- View SHAP-based explanations showing which factors contribute most to your risk
- Get AI-generated medical assessment reports via Google Gemini

### 🥗 Smart Nutrition Management
- AI-generated diabetic-friendly meal plans with optimized macronutrient ratios (45% Carb, 20% Protein)
- Custom recipe builder with ingredient-level calorie tracking
- Daily meal scheduling with real-time nutritional balance monitoring
- Automatic TDEE calculation based on personal health data

### 🏃 Exercise Tracking
- MET-based calorie burn calculations
- Daily exercise logging with energy expenditure tracking
- Custom exercise creation with categorization
- Progress monitoring with daily burn goals

### 📊 Health Analytics Dashboard
- Interactive risk trend charts (Recharts)
- BMI history visualization
- Monthly nutrition & activity calendar
- Calorie deficit tracking with macro breakdowns

### 👨‍⚕️ Multi-Role System
- **Patient**: Full health management suite
- **Doctor**: Patient list management, view patient records and health history
- **Admin**: System-wide exercise and food database management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express 5, Sequelize ORM, JWT, bcrypt |
| **AI Service** | Python, FastAPI, CatBoost, SHAP, Google Gemini API |
| **Database** | MySQL |
| **DevOps** | Concurrently (multi-service), Docker (AI service) |

---

## Project Structure

```
Healthcare_Web_Project/
├── frontend_app/                # React Frontend (Vite)
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── exercises/       # Exercise modals
│       │   ├── meals/           # Meal & recipe modals
│       │   └── ui/              # Base UI (Button, Input, Tooltip)
│       ├── context/             # React Context (Auth)
│       ├── layouts/             # App shell (Header, Sidebar, MainLayout)
│       ├── pages/               # Route pages
│       │   ├── Admin/           # Admin panel
│       │   ├── Assessment/      # AI health assessment
│       │   ├── Auth/            # Login, Register, Forgot Password
│       │   ├── Calendar/        # Monthly health calendar
│       │   ├── Dashboard/       # Main dashboard
│       │   ├── Exercises/       # Exercise tracking
│       │   ├── History/         # Health history & charts
│       │   ├── Meals/           # Meal management
│       │   ├── Patients/        # Doctor's patient list
│       │   └── Profile/         # User profile
│       └── services/            # API service layer (Axios)
│
├── main_backend/                # Node.js Backend (Express)
│   └── src/
│       ├── config/              # Database configuration
│       ├── controllers/         # Route handlers
│       ├── middlewares/         # JWT authentication middleware
│       ├── models/              # Sequelize ORM models
│       ├── routes/              # Express route definitions
│       └── seeders/             # Database seed data
│
└── ai_service/                  # Python AI Service (FastAPI)
    └── app/
        ├── api/                 # API endpoints (predict, nutrition)
        ├── models/              # ML model files (.joblib)
        ├── schemas/             # Pydantic request/response schemas
        └── services/            # Core logic (inference, LLM agent)
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.10
- **MySQL** >= 8.0
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/theliems-76/AI-Powered-Healthcare-Management-System.git
cd AI-Powered-Healthcare-Management-System
```

### 2. Set up environment variables

```bash
# Backend
cp main_backend/.env.example main_backend/.env
# Edit main_backend/.env with your database credentials and JWT secret

# AI Service
cp ai_service/.env.example ai_service/.env
# Edit ai_service/.env with your Gemini API key
```

### 3. Install dependencies

```bash
# Root (concurrently)
npm install

# Frontend
cd frontend_app && npm install && cd ..

# Backend
cd main_backend && npm install && cd ..

# AI Service
cd ai_service && pip install -r requirements.txt && cd ..
```

### 4. Set up the database

```sql
CREATE DATABASE healthcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The application will automatically sync tables on first run via Sequelize.

### 5. Run all services

```bash
npm start
```

This starts all 3 services concurrently:
| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend (Node.js) | http://localhost:5000 |
| AI Service (FastAPI) | http://localhost:8000 |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & receive JWT |

### Health Records
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/records/assess` | Submit health data for AI assessment |
| GET | `/api/records/history` | Get assessment history with charts |
| GET | `/api/records/:id` | Get detailed record with SHAP explanation |

### Meals & Nutrition
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meals/dishes` | List all available dishes |
| POST | `/api/meals/custom-dish` | Create custom dish with ingredients |
| POST | `/api/meals/schedule` | Schedule a meal for a date |
| GET | `/api/meals/schedule` | Get daily meal schedule |
| GET | `/api/meals/daily-goal` | Get personalized TDEE target |

### Exercises
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List all exercises |
| POST | `/api/exercises/custom` | Create custom exercise |
| POST | `/api/exercises/schedule` | Log exercise session |
| GET | `/api/exercises/schedule` | Get daily exercise log |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile data |
| GET | `/api/users/patients` | Get doctor's patient list |

---

## Screenshots

> Screenshots will be added soon.

---

## License

This project is developed as a graduation thesis (Khóa luận tốt nghiệp) for academic purposes.
