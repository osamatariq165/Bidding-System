# Real-Time Bidding System Simulation

This project is a full-stack real-time bidding platform built as part of an interview assignment.  
It allows multiple users to place bids on auction items, with live updates broadcast to all connected clients.

✅ **Live Demo:**  
[https://bidding-system-ten.vercel.app/](https://bidding-system-ten.vercel.app/)

---

## ✨ Features

- **Backend (NestJS + PostgreSQL + TypeORM):**
  - REST APIs to list auctions, create auctions, place bids
  - Socket.io WebSocket Gateway to broadcast real-time bid updates
  - Database transactions with pessimistic locking to prevent race conditions during concurrent bidding

- **Frontend (React + Vite + Socket.io):**
  - Browse available auctions
  - View auction details and live bid history
  - Place bids and see updates instantly
  - Clean, responsive UI

- **Deployment:**
  - Backend deployed on **Render**
  - Frontend deployed on **Vercel**

---

## 💡 Handling Concurrency and Race Conditions

This system is designed to handle **multiple users placing bids at the same time** without data inconsistency.

When a bid is placed:
- A **database transaction** is started.
- The auction row is locked using `SELECT ... FOR UPDATE` (`pessimistic_write`) so no other process can modify it.
- The highest bid is re-validated **inside the transaction**.
- The bid is saved and the auction price updated atomically.
- Once committed, other transactions are allowed to proceed.

This ensures:
- No race conditions
- No two bids accepted at the same price
- Consistent state in the database

---

## 🛠️ Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL, Socket.io
- **Frontend:** React, Vite, TypeScript, Socket.io-client
- **Database:** PostgreSQL (Neon for production)
- **Deployment:** Render (API), Vercel (Frontend)

---

## 🚀 Running Locally

> You can run both backend and frontend locally for development.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/osamatariq165/Bidding-System.git
cd your-repo
cd paynest-backend
npm install
// Adjust credentials if you use Neon or another Postgres service in .ENV file
npm run start:dev
// Backend will be ready on: http://localhost:3000
// Then move to frontend
cd ../frontend
npm install
npm run dev
// Frontend will be readt at: http://localhost:5173
```

## 💡 Docker Builds
To run the application through Docker build command, use the following:
```bash
docker-compose build
```
This will run both the frontend and backend simaltanously.
If you want to run services individually:
Frontend: docker run -p 8080:80 my-frontend
Backend: docker run -p 3000:3000 --env-file .env my-backend

## 💡 Production URLs
Frontend (Vercel):
[https://bidding-system-ten.vercel.app/](https://bidding-system-ten.vercel.app/)

Backend (Render):
[https://your-backend-service.onrender.com](https://bidding-system.onrender.com)

