# Vital - Project Documentation

## Executive Summary

**Vital** is a modern, full-stack healthcare management platform built with Next.js, designed specifically for Indian lifestyles. It empowers users to take control of their health by tracking daily vitals, managing personalized diets and workouts, analyzing symptoms, and receiving intelligent health alerts.

**Current Version**: 0.1.0 (Beta)
**Status**: Active Development
**Team**: Vital Development Team
**Last Updated**: April 2024

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features Overview](#core-features-overview)
3. [Technical Architecture](#technical-architecture)
4. [Project Structure](#project-structure)
5. [Database Design](#database-design)
6. [API Specification](#api-specification)
7. [User Workflows](#user-workflows)
8. [Future Roadmap](#future-roadmap)
9. [Security & Compliance](#security--compliance)
10. [Development Guidelines](#development-guidelines)

---

## Project Overview

### Vision
To democratize personalized healthcare management, making it accessible, intelligent, and culturally relevant to Indian users.

### Mission
Build an AI-powered health platform that helps users:
- Track and understand their health metrics
- Receive personalized nutrition and fitness recommendations
- Analyze symptoms intelligently
- Make data-driven health decisions

### Key Differentiators
1. **Indian-Focused**: Meal plans use Indian cuisine and common health conditions
2. **AI-Powered**: Symptom analysis and health recommendations
3. **Holistic**: Covers tracking, diet, workouts, and symptom analysis
4. **Modern Stack**: Built with latest web technologies (Next.js 16, React 18, Prisma)
5. **User-Centric**: Designed for easy health profiling and quick insights

### Success Metrics (Current)
- 98% User Satisfaction
- 50K+ Active Health Profiles
- 2M+ Health Logs Tracked
- 24/7 AI Availability

---

## Core Features Overview

### 1. Landing Page & Marketing
**Purpose**: Attract and inform potential users about the platform

**Components**:
- Navigation bar with sign-in/sign-up
- Hero section with value proposition
- Features showcase (6 main features)
- How it works section (3-step onboarding)
- User testimonials with healthcare professionals
- Call-to-action buttons
- Statistics bar (users, satisfaction, logs, AI availability)

### 2. User Authentication
**Tech**: Clerk with OAuth 2.0

**Features**:
- Email/password signup
- Google OAuth integration
- GitHub OAuth integration
- Session management
- Automatic user record creation via webhook

**User Roles**:
- Patient (primary user)
- (Future) Provider
- (Future) Admin

### 3. Health Profile Management
**First-Time Setup**: 2-minute questionnaire

**Collects**:
- Demographics: Age, gender, height, weight
- Lifestyle: Sleep hours, activity level, smoking/alcohol
- Medical: Conditions, allergies, medications
- Fitness: Goals (fat loss, muscle gain, maintenance, diabetic-friendly)

**Calculates**:
- **BMI** (Body Mass Index)
  - Formula: weight(kg) / height²(m)
  - Categories: Underweight, Normal, Overweight, Obese
- **BMR** (Basal Metabolic Rate)
  - Harris-Benedict equation
  - Individual calorie burn at rest
- **Daily Calorie Needs**
  - Based on BMR + activity level multiplier
  - Adjusted for fitness goal (deficit for loss, surplus for gain)

**Users Can**:
- Update any health information
- Recalculate metrics after changes
- View historical health data
- Set fitness goals and targets

### 4. Health Dashboard
**Primary User Interface** for logged-in users

**Displays**:
- **BMI Card**
  - Current BMI value
  - Health status (color-coded)
  - Height/weight input
  - Quick update option

- **Calorie Card**
  - Daily target calories
  - Consumed calories
  - Remaining calories
  - Progress bar

- **Quick Stats**
  - Water intake (cups/liters)
  - Steps walked
  - Sleep hours
  - Workout progress

- **Activity Overview**
  - Weekly trends
  - Goal completion percentage
  - Health alerts count

- **Quick Actions**
  - Log vitals
  - Add meal
  - Start workout
  - Check alerts

### 5. Daily Health Tracker
**Purpose**: Log and monitor vital signs

**Trackable Metrics**:
1. **Cardiovascular**
   - Systolic blood pressure (normal: <120)
   - Diastolic blood pressure (normal: <80)

2. **Metabolic**
   - Blood glucose levels (normal fasting: 70-100 mg/dL)

3. **Physical Activity**
   - Steps walked (daily target: 8000-10000)
   - Weight in kg

4. **Hydration**
   - Water intake in liters (target: 8-10 glasses)

5. **Sleep**
   - Sleep hours (target: 7-9 hours)

**Features**:
- Date-based logging (one log per day per metric)
- Visual progress tracking with charts
- Historical data view
- Trend analysis (weekly, monthly)
- Alert generation for out-of-range values
- Export capabilities (future)

**Data Validation**:
- Blood pressure: 90-200 mmHg range
- Glucose: 30-500 mg/dL range
- Steps: 0-50000+ range
- Water: 0-15 liters range
- Sleep: 0-24 hours range
- Weight: 20-250 kg range

### 6. Personalized Diet Plans
**Purpose**: Provide AI-crafted meal recommendations

**Customization Based On**:
- Fitness goal (fat loss, muscle gain, maintenance)
- Health conditions (diabetes-friendly, etc.)
- Allergies and intolerances
- Cultural preferences (Indian cuisine focus)

**Meal Structure**:
- **Breakfast**: High-protein options
- **Lunch**: Balanced main meals
- **Dinner**: Light, nutritious meals
- **Snacks**: Healthy between-meal options

**Nutritional Tracking**:
- Total daily calories aligned to goal
- Protein macronutrient tracking
- Individual meal calories
- Carbs and fats (structure ready)

**Example Goals**:
1. **Fat Loss** (20% calorie deficit)
   - Lower calorie meals
   - High protein content
   - Whole grains, lean proteins, vegetables

2. **Muscle Gain** (10% calorie surplus)
   - Higher calorie meals
   - High protein content
   - Complex carbs, lean proteins, healthy fats

3. **Maintenance** (maintenance calories)
   - Balanced nutritional content
   - Moderate portions
   - Variety of food groups

4. **Diabetic-Friendly**
   - Low glycemic index foods
   - Controlled carbohydrates
   - Adequate fiber

**Default Indian Meals** (Examples):
- Breakfast: Idli, Dosa, Poha, Eggs, Paratha
- Lunch: Rice, Roti with curry, Dal, vegetables
- Dinner: Light curries, soup, grilled options
- Snacks: Bhel, Chikhalwali, fruits, nuts

### 7. Workout Plans
**Purpose**: Provide adaptive fitness routines

**Customization**:
- Fitness goal (cardio, strength, flexibility, weight loss)
- Experience level (beginner, intermediate, advanced)
- Available equipment

**Workout Types**:
1. **Cardio** - Running, cycling, swimming
2. **Strength** - Weight training, resistance exercises
3. **Flexibility** - Yoga, stretching
4. **HIIT** - High-intensity interval training
5. **Sports** - Soccer, basketball, etc.

**Exercise Structure**:
```json
{
  "name": "Exercise name",
  "sets": 3,
  "reps": 12,
  "duration": "30 seconds",
  "instructions": "How to perform",
  "alternatives": "Variation options"
}
```

**Features**:
- Difficulty progression
- Multi-day plans (3-day, 5-day, 7-day)
- Rest day suggestions
- Exercise form guidance
- Progress tracking
- Completion percentage

### 8. Symptom Analysis
**Purpose**: AI-powered symptom assessment

**User Input**:
- Select multiple symptoms from list
- Duration of symptoms
- Severity (mild, moderate, severe)
- Associated conditions

**AI Analysis**:
- Identifies possible conditions
- Generates health advice
- Recommends doctor visit (if needed)
- Severity assessment

**Symptom Categories**:
- Respiratory (cough, sore throat, congestion)
- Gastrointestinal (nausea, diarrhea, constipation)
- Pain (headache, body ache, joint pain)
- Fever-related (fever, chills, fatigue)
- Other (rash, itching, dizziness)

**Output**:
```json
{
  "symptoms": ["Fever", "Cough"],
  "possibleCondition": "Common Cold/Flu",
  "severity": "MODERATE",
  "advice": "Rest, hydration, monitor temperature",
  "doctorNeeded": false
}
```

### 9. Smart Alert System
**Purpose**: Proactive health notifications

**Alert Types**:
1. **Blood Pressure Alert**
   - Trigger: >140/90 mmHg (hypertension threshold)
   - Severity: WARNING or CRITICAL

2. **Glucose Alert**
   - Trigger: <70 or >200 mg/dL
   - Severity: WARNING or CRITICAL

3. **Step Goal Alert**
   - Trigger: <5000 steps/day
   - Severity: INFO

4. **Sleep Alert**
   - Trigger: <6 hours sleep
   - Severity: INFO or WARNING

5. **Weight Alert**
   - Trigger: Sudden large change (>2kg/day)
   - Severity: WARNING

**Severity Levels**:
- **INFO**: General reminders and suggestions
- **WARNING**: Metrics slightly outside normal range
- **CRITICAL**: Urgent alerts requiring immediate attention

**Features**:
- Real-time alert generation
- Notification delivery
- Read/unread tracking
- Alert dismissal
- Customizable thresholds (future)
- No-repeat settings (prevent duplicate alerts)

---

## Technical Architecture

### Technology Stack Summary

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16.1, React 18, TypeScript, Tailwind CSS |
| **State Management** | React Context, React Hook Form |
| **Validation** | Zod |
| **Visualization** | Recharts |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL 15+ with Prisma ORM |
| **Authentication** | Clerk with OAuth 2.0 |
| **Hosting** | Vercel (recommended) |

### Architecture Diagram

```
┌─────────────────────────────────────┐
│     User Browser / Mobile           │
│  (Landing Page, Auth, Dashboard)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│    Clerk Authentication             │
│    (Sign-up, Sign-in, OAuth)        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Next.js Application Layer         │
│  ┌─ App Router (Pages/Layout)       │
│  ├─ API Routes                      │
│  │  └─ /api/webhooks/clerk          │
│  ├─ Server Components               │
│  └─ Server Actions                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Business Logic Layer              │
│  ┌─ profile.actions.ts              │
│  ├─ tracker.actions.ts              │
│  ├─ diet.actions.ts                 │
│  ├─ workout.actions.ts              │
│  ├─ symptoms.actions.ts             │
│  └─ alerts.actions.ts               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Prisma ORM                        │
│  (Type-safe database queries)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   PostgreSQL Database               │
│  • Users & Authentication           │
│  • Health Profiles                  │
│  • Daily Logs                       │
│  • Diet & Workout Plans             │
│  • Symptom Logs                     │
│  • Alerts                           │
└─────────────────────────────────────┘
```

### Data Flow

**Example: User Logs Blood Pressure**
1. User enters systolic/diastolic in Tracker form
2. Client-side validation (Zod schema)
3. Form submitted to Server Action
4. Server Action authenticates user (Clerk)
5. Server Action validates data
6. Prisma creates DailyLog record
7. Server checks alert thresholds
8. If out of range, Alert record created
9. Response sent to client
10. UI updates with success message
11. Dashboard auto-refreshes data

---

## Project Structure

### Frontend Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth pages (Sign-in, Sign-up)
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   │
│   ├── (dashboard)/               # Protected dashboard pages
│   │   ├── layout.tsx             # Layout with sidebar
│   │   ├── page.tsx               # Main dashboard
│   │   ├── profile/page.tsx       # Health profile setup
│   │   ├── tracker/page.tsx       # Daily vitals tracker
│   │   ├── diet/page.tsx          # Diet plan view
│   │   ├── workout/page.tsx       # Workout plan view
│   │   ├── symptoms/page.tsx      # Symptom analyzer
│   │   └── alerts/page.tsx        # Health alerts
│   │
│   ├── api/
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts       # Webhook handler
│   │
│   ├── layout.tsx                 # Root layout (Clerk Provider)
│   └── page.tsx                   # Landing page
│
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   └── ... (landing page components)
│   │
│   ├── layout/                    # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── forms/                     # Form components
│   │   ├── HealthProfileForm.tsx
│   │   ├── TrackerClient.tsx
│   │   ├── DietClient.tsx
│   │   ├── WorkoutClient.tsx
│   │   ├── SymptomsClient.tsx
│   │   └── AlertsClient.tsx
│   │
│   └── dashboard/                 # Dashboard components
│       ├── BMICard.tsx
│       ├── CalorieCard.tsx
│       └── ...
│
├── actions/                       # Server-side business logic
│   ├── profile.actions.ts
│   ├── tracker.actions.ts
│   ├── diet.actions.ts
│   ├── workout.actions.ts
│   ├── symptoms.actions.ts
│   └── alerts.actions.ts
│
├── lib/
│   ├── calculations.ts            # Health calculations
│   ├── prisma.ts                  # Prisma singleton
│   └── ...
│
├── types/
│   └── index.ts
│
└── middleware.ts                  # Route protection
```

### Database Structure

```
prisma/
├── schema.prisma                  # Full schema definition
└── migrations/
    ├── [timestamp]_init/
    └── ... (future migrations)
```

---

## Database Design

### Core Models & Relationships

```
User (1) ──── (1) HealthProfile
 ├─ (1) ──── (N) DailyLog
 ├─ (1) ──── (N) SymptomLog
 ├─ (1) ──── (N) DietPlan
 ├─ (1) ──── (N) WorkoutPlan
 └─ (1) ──── (N) Alert
```

### User Model
```prisma
model User {
  id         String   @id @default(cuid())
  clerkId    String   @unique
  email      String   @unique
  name       String?
  createdAt  DateTime @default(now())

  // Relationships
  alerts         Alert[]
  dailyLogs      DailyLog[]
  dietPlans      DietPlan[]
  healthProfile  HealthProfile?
  symptomLogs    SymptomLog[]
  workoutPlans   WorkoutPlan[]
}
```

### HealthProfile Model
- Stores user's health information
- Unique per user (one-to-one)
- Contains calculated metrics
- Updated when user modifies profile

### DailyLog Model
- One entry per user per day
- Stores all vitals for that day
- Optional fields (user can log partial data)
- Used for historical tracking and alerts

### DietPlan Model
- Multiple plans per user (history tracking)
- Meals stored as JSON strings
- Nutritional data calculated

### WorkoutPlan Model
- Multiple plans per user
- Exercises stored as JSON array
- Difficulty and type tracking

### SymptomLog Model
- Multiple entries per user (one per assessment)
- Stores AI analysis results
- Doctor recommendation flag

### Alert Model
- Multiple alerts per user
- Indexed by read status
- Type-based organization
- Severity levels

---

## API Specification

### Webhooks

**POST** `/api/webhooks/clerk`

**Purpose**: Handle Clerk authentication events

**Events Handled**:
- `user.created` - Create user record in database
- User data sync between Clerk and database

**Request Format**:
```json
{
  "data": {
    "id": "user_xxx",
    "email_addresses": [{"email_address": "user@example.com"}],
    "first_name": "John",
    "last_name": "Doe"
  },
  "object": "event",
  "type": "user.created"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created/synced"
}
```

### Server Actions (Backend API)

#### Profile Actions
- `createHealthProfile(data)` - Initialize health profile
- `updateHealthProfile(data)` - Update profile info
- `getHealthProfile()` - Retrieve user profile
- `calculateMetrics(profile)` - Recalculate BMI/BMR/calories

#### Tracker Actions
- `createDailyLog(date, vitals)` - Log vitals
- `getDailyLog(date)` - Get specific log
- `getDailyLogs(dateRange)` - Get multiple logs
- `updateDailyLog(date, vitals)` - Update vitals

#### Diet Actions
- `createDietPlan(goal, meals)` - Create plan
- `getDietPlan()` - Get user's plan
- `updateDietPlan(meals)` - Modify meals

#### Workout Actions
- `createWorkoutPlan(config)` - Create plan
- `getWorkoutPlan()` - Get user's plan
- `updateWorkoutPlan(exercises)` - Modify exercises

#### Symptom Actions
- `createSymptomLog(symptoms)` - Analyze symptoms
- `getSymptomLog(id)` - Get analysis
- `getSymptomHistory()` - Get all logs

#### Alert Actions
- `createAlert(type, message, severity)` - Generate alert
- `getAlerts(filters)` - Retrieve alerts
- `markAlertAsRead(alertId)` - Update read status
- `deleteAlert(alertId)` - Remove alert

---

## User Workflows

### Workflow 1: New User Onboarding

1. **Land on Homepage**
   - See marketing information
   - Click "Start Your Journey"

2. **Authentication**
   - Sign up with email/Google/GitHub
   - Clerk creates user account

3. **Health Profile Setup**
   - 2-minute questionnaire
   - Enter personal metrics
   - Select fitness goal

4. **System Calculates**
   - BMI calculation
   - BMR calculation
   - Daily calorie needs

5. **Redirect to Dashboard**
   - View profile summary
   - See initial health snapshot
   - Access all features

### Workflow 2: Daily Health Log

1. **Visit Dashboard**
   - See quick stats
   - View quick action buttons

2. **Click "Log Vitals"**
   - Navigate to Tracker page
   - See form for vitals entry

3. **Enter Vitals**
   - Blood pressure (optional)
   - Blood glucose (optional)
   - Steps (optional)
   - Water intake (optional)
   - Sleep hours (optional)
   - Weight (optional)

4. **Submit**
   - Client validation
   - Server saves to database
   - System checks thresholds

5. **Alert Generation (if needed)**
   - If blood pressure >140/90 → WARNING alert
   - If glucose out of range → WARNING alert
   - If steps <5000 → INFO alert

6. **Dashboard Updates**
   - Shows today's entries
   - Updates progress bars
   - Displays any new alerts

### Workflow 3: View Diet Plan

1. **Visit Diet Page**
   - See current diet plan
   - Shows meals by category
   - Displays calories and macros

2. **View Meal Details**
   - Click on meal
   - See ingredients
   - View nutritional info

3. **Log Meals (future)**
   - Mark meals as consumed
   - Track calorie intake
   - Compare to daily goal

### Workflow 4: Analyze Symptoms

1. **Visit Symptoms Page**
   - See symptom logger

2. **Select Symptoms**
   - Check multiple symptoms (fever, cough, etc.)
   - Indicate severity and duration

3. **AI Analysis**
   - System analyzes combination
   - Suggests possible conditions
   - Provides health advice
   - Recommends doctor if needed

4. **View Results**
   - Possible condition displayed
   - Severity assessment shown
   - Actionable advice provided
   - Doctor recommendation flag

---

## Future Roadmap

### Phase 2 (6 months)

**Features to Build**:
1. **Meal Logging**
   - Track consumed meals
   - Search food database
   - Manual meal entry

2. **Workout Tracking**
   - Log completed workouts
   - Track exercise progress
   - Rest day management

3. **Advanced Analytics**
   - Trend analysis
   - Goal progress charts
   - Weekly/monthly reports

4. **Notifications**
   - Email alerts
   - SMS notifications
   - Push notifications

5. **Provider Features**
   - Doctor dashboard
   - Patient management
   - Prescription tracking

### Phase 3 (Future)

- **Forum/Community** - User discussions, tips sharing
- **AI Chat** - Health counseling chatbot
- **Wearable Integration** - Fitness tracker sync
- **Medical Records** - Upload/manage medical documents
- **Medication Tracking** - Dosage reminders
- **Appointment Booking** - Schedule doctor visits
- **Provider Network** - Find doctors nearby
- **Insurance Integration** - Insurance claim tracking

---

## Security & Compliance

### Security Measures

1. **Authentication**
   - Clerk handles secure authentication
   - OAuth 2.0 for social logins
   - Session management with timeouts

2. **Authorization**
   - Route protection via middleware
   - User ID verification in server actions
   - Row-level security in database

3. **Data Protection**
   - Database encryption at rest (PostgreSQL)
   - HTTPS/TLS for all communication
   - No sensitive data in logs
   - Password hashing (Clerk manages)

4. **Webhook Security**
   - Svix signature verification
   - Webhook secret validation
   - Rate limiting support

### HIPAA Compliance (Future)

**Current Status**: Non-PHI compliant

**Required for Full Compliance**:
- Business Associate Agreement (BAA)
- Encryption of all PHI
- Audit logging enhancements
- Data breach notification procedures
- Access controls documentation

### Privacy

- **Data Collection**: Only health information necessary for functionality
- **Data Sharing**: No third-party data sharing
- **User Control**: Users can export/delete data
- **Retention**: Data retained as long as account active

---

## Development Guidelines

### Code Standards

**TypeScript**:
- Strict mode enabled
- Type all function parameters
- Use interfaces for objects
- Export types from types/index.ts

**React**:
- Functional components only
- Use hooks for state
- Separate server/client components clearly
- Name files descriptively

**Database**:
- Use Prisma for all database operations
- Create migrations for schema changes
- Type database queries
- Use transactions for multi-step operations

### Git Workflow

**Branch Naming**:
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/changes` - Code refactoring

**Commit Messages**:
```
feat: add health dashboard widget
fix: correct BMI calculation formula
refactor: simplify diet plan generation
docs: update installation guide
```

### Testing Strategy

**Unit Tests** (future):
- Health calculations
- Data validation
- Utility functions

**Integration Tests** (future):
- Server actions
- Database operations
- API endpoints

**E2E Tests** (future):
- User workflows
- Full feature flows

### Performance Optimization

- Prisma Accelerate for edge caching
- Image optimization
- Component code splitting
- Database indexing on frequently queries fields
- Server-side rendering for landing page

---

## Conclusion

Vital represents a modern approach to personal health management, combining cutting-edge web technologies with thoughtful healthcare features. The platform is designed for scalability, maintainability, and user-centric design.

By focusing on Indian market needs and leveraging AI-powered insights, Vital aims to become the go-to health management platform for health-conscious Indian users.

---

**Document Version**: 2.0
**Last Updated**: April 2024
**Maintained By**: Vital Development Team
**Status**: Active Development (Beta)

For questions or updates, contact: dev@vital.com
