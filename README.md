📚 Daily Learning — Personal Roadmap Tracker

A full-stack learning roadmap platform that helps users follow structured, day-by-day learning courses, track tasks and progress, maintain learning notes, and receive daily reminders.

🌐 Live Application: https://daily-learning-bw3t.onrender.com/

🚀 Overview

Daily Learning is a multi-course learning tracker rather than a single-course todo application.

Users can:

Create an account and log in

Select a learning roadmap/course

Follow the roadmap day by day

Track individual learning tasks

Mark days as in progress or completed

Record personal learning notes

View overall course progress

Continue from the first incomplete day

Configure daily learning reminders

Receive email reminders for incomplete daily learning

The application is designed around the rule that a user works on one active course at a time and can move to another course after completing the current course.

✨ Key Features

🔐 Authentication

User registration

Login

JWT-based authentication

Password hashing

Forgot-password flow

Protected application routes

🗺️ Multiple Learning Roadmaps

Current roadmaps include:

Data Engineering

Full Stack Development

Java Developer

Flutter Developer

Angular Developer

SQL & Database Developer

Each roadmap is structured as a 45-day learning journey.

📈 Progress Tracking

Track progress at multiple levels:

Course progress

Day progress

Individual task completion

Learning notes

Started/completed timestamps

Typical learning flow:

Select Course
      ↓
Start Day
      ↓
Complete Tasks
      ↓
Add Learning Notes
      ↓
Complete Day
      ↓
Next Day
      ↓
100% Course Completion
      ↓
Choose Another Course

📅 Daily Learning

Each day contains:

Phase

Topic

Description

Practical tasks

Completion status

Personal notes

The roadmaps progress from fundamentals to advanced topics, projects, and interview preparation.

🔔 Daily Reminders

The backend includes a scheduled reminder system.

Default reminder:

Time     : 8:00 PM
Timezone : Asia/Kolkata

The scheduler checks the user's daily progress and avoids sending a reminder when the day's learning is already completed.

Email notifications are supported through the backend notification service. SMS/Twilio integration is included in the project architecture and can be enabled/configured when required.

📝 Learning Notes

Users can record what they learned for each day.

⚙️ Settings

Users can configure learning and notification preferences such as:

Email

Mobile number

Reminder time

Timezone

Email notification preference

SMS notification preference

🛡️ Cloudflare Turnstile

Cloudflare Turnstile is integrated for bot protection around authentication-related flows. For production deployment, configure a production Turnstile site key and secret key rather than using Cloudflare's testing credentials.

🏗️ Architecture

                    ┌─────────────────────┐
                    │     React App       │
                    │   Vite + Ant Design │
                    └──────────┬──────────┘
                               │
                              REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
                ┌──────────┘       └─────────────┐
                ▼                                ▼
        ┌───────────────┐                ┌──────────────┐
        │    MongoDB    │                │ Notifications│
        │   / Mongoose  │                │ Email / SMS  │
        └───────────────┘                └──────┬───────┘
                                                │
                                           Scheduler
                                           8:00 PM IST

🛠️ Tech Stack

Frontend

React

Vite

React Router

Ant Design

Axios

JavaScript

Responsive UI

Backend

Node.js

Express.js

REST APIs

JWT Authentication

bcrypt/password hashing

node-cron

Nodemailer / email service

Twilio integration

Database

MongoDB

Mongoose

Security

JWT

Password hashing

Environment variables

Cloudflare Turnstile

Protected API routes

Deployment

Render

MongoDB

📁 Project Structure

Daily-Learning/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   └── notificationService.js
│   ├── jobs/
│   │   └── reminderJob.js
│   ├── middleware/
│   ├── seed/
│   └── server.js
│
├── .env.example
├── .gitignore
└── README.md

🗃️ Core Data Model

Conceptually:

User
 │
 └── Active Roadmap
          │
          ├── Day 1
          ├── Day 2
          ├── Day 3
          └── ...

User progress stores information such as:

userId
roadmapId
dayId / dayNumber
status
tasks
notes
startedAt
completedAt

Notification records can track the notification type, sent time, status, and errors.

🗺️ Current Roadmap Structure

Each course follows a 45-day structure.

Data Engineering

SQL & relational data, Python, PySpark, Databricks, Delta Lake, data engineering pipelines, portfolio project, and interview preparation.

Full Stack Development

HTML, CSS, JavaScript, Git, React, Node.js, databases, authentication, testing, DevOps, deployment, project work, and interview preparation.

Java Developer

Core Java, OOP, collections, advanced Java, Maven, SQL, Spring, Spring Boot, REST APIs, microservices, and interview preparation.

Flutter Developer

Dart, Flutter widgets, UI development, navigation, state management, API integration, databases, testing, and release/deployment.

Angular Developer

TypeScript, Angular fundamentals, components, routing, forms, HTTP, RxJS, Signals, state management, authentication, testing, deployment, and interview preparation.

SQL & Database Developer

SQL fundamentals, advanced SQL, CTEs, window functions, database design, normalization, indexes, views, PL/SQL, procedures, functions, packages, triggers, transactions, performance tuning, database security, and interview preparation.

⚙️ Environment Variables

Create a backend .env file using values appropriate for your environment.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
REMINDER_EMAIL=your_email

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_turnstile_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
USER_PHONE_NUMBER=your_phone_number

# Roadmap
ROADMAP_START_DATE=YYYY-MM-DD

Never commit .env or production secrets to GitHub.

💻 Local Development

1. Clone the repository

git clone <your-github-repository-url>
cd Daily-Learning

2. Install frontend dependencies

cd frontend
npm install

3. Install backend dependencies

cd ../server
npm install

4. Configure environment variables

Create the required .env file in the backend.

5. Start the backend

npm start

Use the development command configured in the backend package if different.

6. Start the frontend

cd frontend
npm run dev

🌱 Roadmap Seeding

The project includes seed data for the learning courses. The seed process creates roadmap templates and daily learning content.

After modifying roadmap content, run the project's configured seed command. Before seeding production data, verify the seed logic so repeated executions do not create unwanted duplicates.

🔔 Reminder Flow

Every minute
     ↓
Check current time
     ↓
Convert to user's timezone
     ↓
Is it the configured reminder time?
     ↓
Find today's roadmap day
     ↓
Check progress
     ↓
Completed?
   /      \\
 YES       NO
  ↓         ↓
 STOP     Send reminder
             │
        ┌────┴────┐
        ▼         ▼
      Email      SMS

The scheduler must run on the backend/server, so reminders do not depend on the user's browser being open.

🔒 Security Notes

Keep secrets in environment variables.

Never expose MongoDB credentials in frontend code.

Never expose JWT secrets in frontend code.

Never expose SMTP passwords in frontend code.

Never expose Twilio authentication tokens in frontend code.

Validate authentication tokens on the backend.

Validate Cloudflare Turnstile tokens on the backend.

Use production Cloudflare Turnstile keys for the deployed application.

🧪 Testing Areas

Recommended areas to test:

Signup/login and protected routes

Forgot password

Course selection

Day/task completion

Progress calculation

Notes

Course completion

Email notifications

SMS notifications when enabled

Reminder time/timezone handling

Invalid JWT and unauthorized APIs

Invalid Turnstile tokens

🚀 Future Improvements

🏆 Achievement badges

🔥 Learning streaks

📅 Learning calendar

📊 Detailed learning analytics

🎓 Course completion certificates

👨‍💼 Admin dashboard

➕ Admin-created roadmaps

✏️ Admin editing of days/tasks

📢 Course publish/unpublish

🏅 Automatic badge achievements

🔔 Push notifications

📱 Progressive Web App support

🤖 AI-powered learning recommendations

📄 Course completion reports

🎯 Project Vision

Choose a Career Path
        ↓
Follow a Structured Roadmap
        ↓
Learn Every Day
        ↓
Track Tasks
        ↓
Build Projects
        ↓
Maintain Learning Streaks
        ↓
Earn Badges
        ↓
Complete Courses
        ↓
Build a Learning Portfolio

👨‍💻 Author

Harish G

Built as a full-stack learning/productivity project to help learners follow structured technical learning paths and consistently track their progress.

⭐ Support

If you find the project useful, give the repository a ⭐ and feel free to suggest improvements or new learning roadmaps.
