# ELITE Trading Academy — Complete Deployment Guide

# From Zero to Live Website — Step by Step

---

## PHASE 1: ACCOUNTS YOU NEED TO CREATE (All Free to Start)

Before anything, create accounts on these platforms:

| Platform      | URL                      | Purpose          | Cost              |
| ------------- | ------------------------ | ---------------- | ----------------- |
| MongoDB Atlas | mongodb.com/cloud/atlas  | Database         | Free 512MB        |
| Cloudinary    | cloudinary.com           | Media storage    | Free 25GB         |
| Railway       | railway.app              | Backend hosting  | Free $5 credit    |
| Vercel        | vercel.com               | Frontend hosting | Free forever      |
| Razorpay      | razorpay.com             | Payments         | Free + 2% per txn |
| Google Cloud  | console.cloud.google.com | Google OAuth     | Free              |
| GitHub        | github.com               | Code repository  | Free              |

---

## PHASE 2: MONGODB ATLAS SETUP

### Step 1 — Create Database

1. Go to mongodb.com/cloud/atlas → Click "Try Free"
2. Create account → Choose "Free" tier (M0)
3. Select region: Mumbai (ap-south-1) for India
4. Cluster name: elite-trading-academy
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 2 — Create Database User

1. Left sidebar → Security → Database Access
2. Click "Add New Database User"
3. Authentication: Password
4. Username: eliteadmin
5. Password: Generate a strong password (SAVE IT)
6. Database user privileges: Atlas admin
7. Click "Add User"

### Step 3 — Allow Network Access

1. Left sidebar → Security → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4 — Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string — looks like:
   mongodb+srv://eliteadmin:<password>@cluster0.xxxxx.mongodb.net/
5. Replace <password> with your actual password
6. Add database name: mongodb+srv://eliteadmin:YOURPASS@cluster0.xxxxx.mongodb.net/elite-trading-academy
7. SAVE THIS — this is your MONGO_URI

---

## PHASE 3: CLOUDINARY SETUP

### Step 1 — Create Account

1. Go to cloudinary.com → Sign Up Free
2. Choose Individual plan (free)
3. Complete registration

### Step 2 — Get API Credentials

1. Dashboard shows your credentials immediately:
   - Cloud Name: (e.g. dxyz123abc)
   - API Key: (numbers)
   - API Secret: (alphanumeric)
2. SAVE ALL THREE — needed in .env file

---

## PHASE 4: GOOGLE OAUTH SETUP

### Step 1 — Create Project

1. Go to console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Project name: ELITE Trading Academy
4. Click "Create"

### Step 2 — Enable Google+ API

1. Left menu → APIs & Services → Library
2. Search "Google+ API" → Enable it
3. Also enable "Google Identity" if shown (me: not found)

### Step 3 — Create OAuth Credentials

1. Left menu → APIs & Services → Credentials
2. Click "Create Credentials" → OAuth client ID
3. Configure consent screen first:
   - User type: External → Create
   - App name: ELITE Trading Academy
   - User support email: your email
   - Developer contact: your email
   - Save and Continue (skip optional fields)
4. Back to Credentials → Create Credentials → OAuth client ID
5. Application type: Web application
6. Name: ELITE Trading Academy Web
7. Authorized JavaScript origins:
   - http://localhost:5173
   - https://yourdomain.com (add after you get domain)
8. Authorized redirect URIs:
   - http://localhost:5000/api/auth/google/callback
   - https://your-backend-url.railway.app/api/auth/google/callback (me: what about shift to render instead of railway)
9. Click Create → SAVE the Client ID and Client Secret

---

## PHASE 5: RAZORPAY SETUP

### Step 1 — Create Account

1. Go to razorpay.com → Sign Up
2. Complete business verification (takes 1-2 days for full activation)
3. For testing, you can use Test Mode immediately

### Step 2 — Get API Keys

1. Dashboard → Settings → API Keys
2. Click "Generate Test Key"
3. SAVE: Key ID and Key Secret
4. For live payments, generate Live Key after business verification

### Step 3 — Test Mode Setup

1. Keep Mode: Test for development (me: already have connected web/ api what to do )
2. Switch to Live only when launching to real customers

---

## PHASE 6: GITHUB REPOSITORY SETUP

### Step 1 — Create Repository

1. Go to github.com → New Repository
2. Name: elite-trading-academy
3. Private (recommended)
4. Click "Create repository"

### Step 2 — Upload Your Code

1. Unzip the downloaded elite-trading-academy.zip
2. Open terminal/command prompt
3. Navigate to the unzipped folder:
   cd elite-trading-academy

4. Initialize git and push:
   git init
   git add .
   git commit -m "Initial commit — ELITE Trading Academy"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/elite-trading-academy.git
   git push -u origin main

---

## PHASE 7: BACKEND DEPLOYMENT (Railway)

### Step 1 — Connect Railway to GitHub

1. Go to railway.app → Login with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select elite-trading-academy repository
5. Select the /backend folder as the source
6. Railway will detect Node.js automatically

### Step 2 — Set Environment Variables

1. In Railway project → Click your service
2. Go to "Variables" tab
3. Click "Add Variable" for each one below:

   PORT = 5000
   NODE_ENV = production
   MONGO_URI = mongodb+srv://eliteadmin:YOURPASS@cluster0.xxxxx.mongodb.net/elite-trading-academy
   JWT_SECRET = GenerateA32CharRandomStringHere1234567
   JWT_EXPIRE = 15m
   JWT_REFRESH_SECRET = AnotherDifferent32CharRandomString
   JWT_REFRESH_EXPIRE = 30d
   JWT_COOKIE_EXPIRE = 30
   GOOGLE_CLIENT_ID = your_google_client_id
   GOOGLE_CLIENT_SECRET = your_google_client_secret
   GOOGLE_CALLBACK_URL = https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   RAZORPAY_KEY_ID = your_razorpay_key_id
   RAZORPAY_KEY_SECRET = your_razorpay_key_secret
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_EMAIL = info@elitetradingacademy.in
   SMTP_PASSWORD = your_gmail_app_password
   FROM_EMAIL = info@elitetradingacademy.in
   FROM_NAME = ELITE Trading Academy
   CLIENT_URL = https://your-vercel-url.vercel.app
   ADMIN_EMAIL = admin@elitetradingacademy.in
   ADMIN_PASSWORD = YourSecureAdminPassword123!
   SESSION_SECRET = YetAnotherRandomStringHere

4. Click "Deploy" — Railway will build and deploy automatically

### Step 3 — Get Your Backend URL

1. Railway → Your service → Settings → Networking
2. Click "Generate Domain"
3. Your URL: https://something.railway.app
4. Test it: visit https://something.railway.app/api/health
5. You should see: {"success":true,"message":"ELITE Trading Academy API running 🚀"}

### Step 4 — Seed the Database

1. Railway → Your service → Click "Run Command"
2. Type: node utils/seeder.js
3. Wait for "Seeding Complete" message
4. Your database now has all dummy data

---

## PHASE 8: GMAIL APP PASSWORD (For Emails)

### Step 1 — Enable 2FA on Gmail

1. Go to myaccount.google.com
2. Security → 2-Step Verification → Enable

### Step 2 — Create App Password

1. myaccount.google.com → Security
2. 2-Step Verification → App passwords (at bottom)
3. Select app: Mail
4. Select device: Other → Type "ELITE Trading Academy"
5. Click Generate
6. SAVE the 16-character password
7. Use this as SMTP_PASSWORD in Railway

---

## PHASE 9: FRONTEND DEPLOYMENT (Vercel)

### Step 1 — Connect Vercel to GitHub

1. Go to vercel.com → Login with GitHub
2. Click "New Project"
3. Import elite-trading-academy repository
4. Framework Preset: Vite
5. Root Directory: frontend
6. Build Command: npm run build
7. Output Directory: dist

### Step 2 — Add Environment Variables

Before clicking Deploy, add:
VITE_API_URL = https://your-railway-url.railway.app
VITE_RAZORPAY_KEY_ID = your_razorpay_key_id

### Step 3 — Deploy

1. Click "Deploy"
2. Vercel builds and deploys in 2-3 minutes
3. Your URL: https://elite-trading-academy.vercel.app

### Step 4 — Update Backend CORS

1. Go back to Railway
2. Update: CLIENT_URL = https://elite-trading-academy.vercel.app
3. Railway redeploys automatically

---

## PHASE 10: CUSTOM DOMAIN SETUP

### Step 1 — Buy a Domain

1. Recommended registrars: GoDaddy, Namecheap, Google Domains
2. Suggested domains:
   - elitetradingacademy.in (₹900/year)
   - elitetradingacademy.com ($12/year)
   - elitetrading.academy ($25/year)

### Step 2 — Connect Domain to Vercel (Frontend)

1. Vercel → Your project → Settings → Domains
2. Add domain: elitetradingacademy.in
3. Vercel gives you DNS records to add
4. Go to your domain registrar → DNS settings
5. Add the records Vercel provides (usually an A record and CNAME)
6. Wait 5-30 minutes for propagation

### Step 3 — Add API Subdomain (Backend)

1. In your domain registrar, add:
   - Type: CNAME
   - Name: api
   - Value: your-railway-url.railway.app              elite-trading-academy-backend.onrender.com
2. In Railway → Your service → Settings → Custom Domain
3. Add: api.elitetradingacademy.in
4. This makes your API available at: api.elitetradingacademy.in
5. Update VITE_API_URL in Vercel to: https://api.elitetradingacademy.in    used (https://api.elitetradingacademy.in/api)

### Step 4 — SSL Certificate

Both Vercel and Railway provide free automatic SSL.
Your site will be HTTPS automatically. No action needed.

---

## PHASE 11: WHATSAPP INTEGRATION (WATI)

### Step 1 — Create WATI Account

1. Go to wati.io → Start Free Trial
2. Connect your WhatsApp Business number
3. Complete the business verification

### Step 2 — Get API Credentials

1. WATI dashboard → API → API Documentation
2. Get your: API Endpoint and Access Token
3. Add to Railway environment variables:
   WATI_API_ENDPOINT = https://live-mt-server.wati.io/YOUR_ACCOUNT_ID
   WATI_ACCESS_TOKEN = your_token

### Step 3 — Create Message Templates

1. WATI → Message Templates → Add New
2. Create templates for:
   - New enrollment notification
   - Franchise lead alert to admin
   - Webinar reminder
3. Templates need WhatsApp approval (24-48 hours)

---

## PHASE 12: TAWK.TO LIVE CHAT

### Step 1 — Create Account

1. Go to tawk.to → Sign Up Free
2. Add your website URL
3. Get your Property ID (looks like: 6xxxxx/1xxxxxx)

### Step 2 — Add to Website

1. Login to your website: elitetradingacademy.in/auth/login
2. Go to: elitetradingacademy.in/admin/settings
3. Find "Integrations" section
4. Paste your Tawk.to Property ID
5. Click Save — live chat appears on your website instantly

---

## PHASE 13: GOOGLE ANALYTICS + META PIXEL

### Google Analytics

1. Go to analytics.google.com
2. Create account → Create Property
3. Platform: Web
4. Website URL: elitetradingacademy.in
5. Get your Measurement ID: G-XXXXXXXXXX
6. Add to Admin Settings → SEO section: Google Analytics ID

### Meta Pixel

1. Go to business.facebook.com
2. Events Manager → Connect Data Source → Web
3. Create Pixel → Name: ELITE Trading Academy
4. Get your Pixel ID (15-16 digit number)
5. Add to Admin Settings → SEO section: Meta Pixel ID

Both activate immediately after saving in Admin Settings.

---

## PHASE 14: FIRST LOGIN & SETUP

### Step 1 — Login as Admin

1. Visit: https://elitetradingacademy.in/auth/login
2. Email: admin@elitetradingacademy.in
3. Password: (whatever you set in ADMIN_PASSWORD)

### Step 2 — Update All Settings

1. Go to: /admin/settings
2. Update every section with your real information:
   - Brand: your logo, tagline
   - Contact: your real phone, email, address
   - Social: your Instagram, YouTube, Telegram links
   - About: your photo, bio, mission
   - SEO: meta title, description
   - Integrations: paste Tawk.to ID

### Step 3 — Update Google Maps Link

1. Go to maps.google.com
2. Search your exact business address
3. Click "Share" → "Copy Link"
4. Paste in Admin Settings → Contact → Google Maps Link
5. Now your address is clickable and opens Google Maps for customers

### Step 4 — Add Your Photo

1. Upload your photo to Cloudinary
2. Copy the URL
3. Admin Settings → About → Founder Photo URL → paste URL → Save

### Step 5 — Update Broker Referral Links

1. Admin → Resources
2. Click edit on each broker
3. Replace placeholder affiliate links with your real referral links
4. Save — website updates instantly

### Step 6 — Add Your First Course

1. Admin → Courses → Add New Course
2. Fill in all details
3. Add sections and lessons
4. Upload videos to Cloudinary, paste URLs
5. Set price → Publish → Course goes live immediately

---

## PHASE 15: ONGOING MANAGEMENT

### How to Make Any Change to Website

1. Login to admin panel: yourdomain.com/admin
2. Go to relevant section
3. Edit any text, image, link, price by just typing
4. Click Save
5. Change reflects on website immediately — no developer needed

### How to Change Any Link (referral, social, etc.)

1. Admin → Settings → relevant section
2. Type new URL/link in the field
3. Save → done

### How to Add Blog Post

1. Admin → Blog → New Post
2. Write content in rich text editor
3. Add SEO title + description
4. Click Publish → live on website

### How to Run a Discount Campaign

1. Admin → Coupons → Create Coupon
2. Set discount type, value, expiry, usage limit
3. Create announcement bar: Admin → Settings → Announcements
4. Share coupon code on Instagram/WhatsApp
5. Students apply code at checkout

### How to Update Stats on Homepage

1. Admin → Settings → Homepage Stats
2. Update numbers (e.g. change 5,000+ to 6,000+)
3. Save → homepage updates instantly

---

## PHASE 16: MOBILE APP (Phase 2 — After Website is Live)

When you're ready to build the mobile app:

### Technology

- React Native with Expo — same codebase for iOS + Android
- Connects to same backend API — no new server needed
- Same MongoDB database — all data synced

### Development Steps

1. Install: npm install -g @expo/cli
2. expo create elite-trading-app
3. Build all screens using existing API endpoints
4. Test on physical device with Expo Go app

### Deployment

- Android → Google Play Store (one-time $25 fee)
- iOS → Apple App Store (one-time $99/year fee)

### App Size Optimization

- Enable Hermes JavaScript engine (already default)
- Use lazy loading for all screens
- Compress all images via Cloudinary
- Target app size: under 25MB

---

## QUICK REFERENCE — IMPORTANT URLS

After deployment, bookmark these:

| URL                                   | Purpose                 |
| ------------------------------------- | ----------------------- |
| elitetradingacademy.in                | Your live website       |
| elitetradingacademy.in/admin          | Admin panel             |
| elitetradingacademy.in/auth/login     | Login page              |
| api.elitetradingacademy.in/api/health | API health check        |
| railway.app/dashboard                 | Backend logs & settings |
| vercel.com/dashboard                  | Frontend deployments    |
| cloud.mongodb.com                     | Database management     |
| cloudinary.com/console                | Media management        |
| razorpay.com/dashboard                | Payment management      |

---

## TROUBLESHOOTING

### "Cannot connect to database"

→ Check MONGO_URI in Railway variables
→ Check MongoDB Atlas Network Access allows 0.0.0.0/0

### "CORS error" in browser

→ Update CLIENT_URL in Railway to match your Vercel URL exactly

### "Google login not working"

→ Add your live URLs to Google Console Authorized redirect URIs

### "Emails not sending"

→ Make sure Gmail has 2FA enabled and you're using App Password
→ Check SMTP credentials in Railway

### "Payment not working"

→ Make sure you're using Test keys for testing
→ Switch to Live keys only after Razorpay business verification

### "Site not loading on custom domain"

→ DNS propagation can take up to 48 hours
→ Check DNS records match what Vercel provided

---

## ESTIMATED MONTHLY COSTS (After Free Tiers)

| Service       | Free Tier            | Paid (when you scale)    |
| ------------- | -------------------- | ------------------------ |
| MongoDB Atlas | 512MB Free           | $9/month (2GB)           |
| Cloudinary    | 25GB Free            | $89/month (225GB)        |
| Railway       | $5 credit/month      | $20/month                |
| Vercel        | 100GB bandwidth Free | $20/month                |
| Domain        | N/A                  | ₹900/year                |
| Razorpay      | Free                 | 2% per transaction       |
| WATI WhatsApp | 1000 msgs/month Free | ₹2499/month              |
| Tawk.to       | Forever Free         | Free (premium $19/month) |

**Total to start: ₹900/year (domain only)**
**At scale (1000+ students): ~₹10,000-15,000/month**
