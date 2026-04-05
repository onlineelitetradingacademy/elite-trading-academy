# ELITE Trading Academy — Complete Setup Guide

## Project Structure
```
elite-trading-academy/
├── backend/          # Node.js + Express API
└── frontend/         # React + Vite app
```

## Quick Start (Local Development)

### Step 1 — Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### Step 2 — Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### Step 3 — Seed Database
```bash
cd backend
npm run seed
```

## Environment Variables (Backend)
See `.env.example` for all required variables.
Critical ones to fill first:
- MONGO_URI — from MongoDB Atlas
- JWT_SECRET — any random 32+ char string
- CLOUDINARY_* — from cloudinary.com
- RAZORPAY_* — from razorpay.com
- GOOGLE_CLIENT_ID/SECRET — from console.cloud.google.com
