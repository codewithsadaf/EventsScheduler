# Event Scheduler

Event Scheduler is a React-based calendar application that lets users create, view, and manage events. It features conflict checking and supports recurring events. The frontend communicates with a backend API to fetch and create events.

## Features

- **Multiple Calendar Views:** Week, month, and day views powered by FullCalendar.
- **Event Creation:** Create new events via a modal form.
- **Conflict Detection:** Prevent overlapping events.
- **Recurring Events:** Option to mark events as recurring with specific days.
- **Live Updates:** Refreshes calendar data after creating events.

## Technologies Used

- **Frontend:** React, FullCalendar, React Hook Form, Axios, Tailwind CSS
- **Backend:** REST API (running on `http://localhost:5000/api`)

## Prerequisites

- Node.js (v12+)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:codewithsadaf/EventsScheduler.git
```

## 2. Project Setup Guide

### Backend (Flask)

### Setup Virtual Environment

1. Ensure you have Python 3.12 installed.
2. Create a virtual environment:
   ```bash
   python3.12 -m venv venv
   ```
3. Activate the virtual environment:
   - For Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```
   - For Windows:
     ```bash
     venv\Scripts\activate
     ```

### Install Dependencies

Once the virtual environment is activated, install the required packages:
```bash
pip install -r requirements.txt
```

### Run the Flask Server

1. Start the Flask development server:
   ```bash
   python app.py
   ```

The server will start at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Frontend (React)

### Setup and Run React Project

1. Navigate to the frontend directory:
   ```bash
   cd EventSchedulingFrontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run devs
   ```

The React app should now be running at [http://localhost:3000](http://localhost:3000).


