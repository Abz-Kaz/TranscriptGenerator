# Transcript Generator Module

This is the "Transcript Generator" module for SafeX Solutions' Marks Entry System. This standalone full-stack module fetches student grades across semesters and generates an official academic transcript in a stunning user interface and downloadable PDF.

## Tech Stack
* **Frontend**: React + TypeScript + Vite + Tailwind CSS
* **Backend**: Node.js + Express + TypeScript + Prisma ORM
* **Database**: SQLite (Ready for PostgreSQL)
* **PDF Engine**: PDFKit

## Prerequisites
* Node.js 18+

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend-node` directory:
```bash
cd backend-node
```

Install dependencies:
```bash
npm install
```

Generate the Prisma Client and seed the mock database:
```bash
npx prisma db push
npm run seed
```

Run the development API server:
```bash
npm run dev
```
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
*The web app will be available at `http://localhost:5173`*

## How to Use
1. Open the web app.
2. Search for a student by name or registration number (e.g., `REG2023001` - John Doe).
3. Click on the student card to view their compiled academic transcript.
4. Review the details (course grades, semester GPAs, and Cumulative GPA).
5. Click **"Download PDF"** to generate and save the official academic transcript document.
