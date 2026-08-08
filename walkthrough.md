# Walkthrough Guide — Data Engineering 45-Day Roadmap Tracker

This guide details the folder structure, local configuration, seeding process, notification test suite, scheduler mechanics, and production deployment options for the **Data Engineering 45-Day Roadmap** tracker application.

---

## 1. Folder Structure

The project is structured cleanly into distinct backend and frontend directories:

```text
Daily Learning/
├── backend/  (server/)
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── roadmapController.js  # Roadmap, tasks & dashboard APIs
│   │   ├── settingsController.js # User profile & dynamic cron API
│   │   └── notificationController.js # Test triggers for Email & SMS
│   ├── models/
│   │   ├── user.js               # Settings & profile schema
│   │   ├── roadmapDay.js         # Topic description & subtask schema
│   │   └── notificationLog.js    # Audit log for SMTP & Twilio dispatches
│   ├── routes/
│   │   └── api.js                # REST API router mappings
│   ├── services/
│   │   ├── emailService.js       # SMTP Nodemailer driver
│   │   ├── smsService.js         # Twilio SMS driver
│   │   └── notificationService.js# Dispatch orchestrator & DB logger
│   ├── jobs/
│   │   └── reminderJob.js        # node-cron scheduler & time parser
│   ├── scripts/
│   │   └── seed.js               # Roadmap seed data population script
│   ├── .env                      # Local server secrets configuration
│   ├── .env.example              # Sample environment template
│   ├── package.json              # Server dependencies & commands
│   └── server.js                 # Application entry point
│
└── client/   (frontend/)
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Stats banner, filters, card grid & calendar
    │   │   ├── DayDetail.jsx     # Topic view, interactive subtasks & notes editor
    │   │   └── Settings.jsx      # Settings configuration & notification testbed
    │   ├── services/
    │   │   └── api.js            # Axios REST API wrapper client
    │   ├── App.jsx               # Navigation layouts, routes & AntD dark themes
    │   ├── index.css             # Main stylesheet (premium gradient visual tokens)
    │   └── main.jsx              # React app mounting file
    ├── vite.config.js            # Vite build parameters
    ├── index.html                # App skeleton referencing main.jsx
    └── package.json              # Frontend library specifications
```

---

## 2. Quickstart & Installation

Follow these steps to spin up the application locally:

### Step A: Clone / Unpack
Navigate to the directory in your shell.

### Step B: Install Dependencies
Open two terminal windows to run both frontend and backend dev environments:

**Terminal 1 (Backend):**
```powershell
cd server
npm install
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm install
```

---

## 3. Environment Secrets Config (`.env`)

In the `server` directory, configure your `.env` file (copied from `.env.example`):

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/de_roadmap
APP_URL=http://localhost:5173

# Email SMTP Config (e.g. Mailtrap, Gmail SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
REMINDER_EMAIL=noreply@deroadmap.com

# Twilio SMS Config
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
USER_PHONE_NUMBER=+919876543210
```

> [!NOTE]
> - All parameters are optional for local testing. If credentials are empty, the backend automatically falls back to **Simulation Mode** (logs reminders to backend console) without crashing!
> - The scheduler works dynamically: changing parameters in the Settings UI immediately reschedules the active cron job.

---

## 4. Seeding the 45-Day Roadmap

Run the database seed script to import the 45-day curriculum. Day 1 is automatically marked as completed, and the remaining 44 days are set to `TODO`:

```powershell
cd server
npm run seed
```

---

## 5. Running the Application Locally

Start both servers to begin tracking your progress:

**Terminal 1 (Backend Server):**
```powershell
cd server
npm run dev
```
*Runs on [http://localhost:5000](http://localhost:5000)*

**Terminal 2 (React Client):**
```powershell
cd frontend
npm run dev
```
*Runs on [http://localhost:5173](http://localhost:5173)*

---

## 6. How to Test Reminders

Rather than waiting until 8:00 PM to verify connections, use the settings test panel:

1. Open the application dashboard in your browser.
2. Click on **Settings & Reminders** in the top navbar.
3. Configure your name, email, phone number, and click **Save Settings**.
4. In the right-hand **Notification Test Center**:
   - Click **Send Test Email** to trigger an instant test message.
   - Click **Send Test SMS** to trigger a Twilio test message.
5. If the configuration fails, a descriptive warning will render detailing the error logs.

---

## 7. How the 8 PM Scheduler Works

1. The backend scheduler initializes `node-cron` on server startup.
2. It fetches your configuration settings (Reminder Time, Timezone, Start Date) from the database.
3. It parses the time string (e.g., `'08:00 PM'`) and registers a cron task at that minute (e.g. `0 20 * * *`) in your target timezone.
4. When the cron fires, it:
   - Evaluates today's roadmap Day number based on your `ROADMAP_START_DATE` configuration.
   - Fetches the topic status for that day from MongoDB.
   - If status is `COMPLETED`, it exits silently.
   - If status is `TODO` or `IN_PROGRESS`, it reads the checkbox statistics (e.g., 3/8 completed) and dispatches reminders to your configured email and SMS number.
   - Logs outcomes to `NotificationLog` collection separately so failures in one channel do not interrupt another.
5. Saving new settings in the UI triggers `rescheduleReminderJob()` to re-register the scheduler dynamically.

---

## 8. Deployment Options (Continuous Reminders)

To keep reminders firing even when your computer is shut down, you must deploy the Node.js backend to a host that runs 24/7:

### Option A: Render / Railway / Heroku (Easiest)
1. Commit your repository to GitHub (excluding `.env`).
2. Deploy the `server` directory as a Web Service on **Render** or **Railway**.
3. Create a free **MongoDB Atlas** shared cluster and copy its connection string.
4. Set up Environment Variables on your hosting provider dashboard (copying `.env` key-values including your Atlas `MONGO_URI`).
5. The provider will automatically keep the Express application running and schedule node-cron tasks.

### Option B: Cloud VM (AWS EC2 / DigitalOcean Droplet)
1. Spin up an Ubuntu LTS virtual machine.
2. Install Node.js, NPM, and PM2:
   ```bash
   sudo apt update
   sudo apt install nodejs npm -y
   sudo npm install pm2 -g
   ```
3. Copy your project to the server, configure `.env`, and start the backend using PM2 to ensure it auto-restarts on crashes:
   ```bash
   pm2 start server.js --name "de-roadmap"
   pm2 startup
   pm2 save
   ```
4. Configure a Nginx reverse proxy to forward traffic to port 5000.
