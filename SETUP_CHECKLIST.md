# TimeFinder Setup Checklist

Follow this checklist to get your app running locally.

## ☑️ Prerequisites

- [ ] Node.js 18+ installed (check with `node --version`)
- [ ] npm installed (check with `npm --version`)
- [ ] Upstash account created at console.upstash.com

## ☑️ Upstash Redis Setup

- [ ] **Logged into** [console.upstash.com](https://console.upstash.com/)
- [ ] **Clicked** "Create Database" button
- [ ] **Named** database (e.g., `timefinder-dev`)
- [ ] **Selected** region closest to you
- [ ] **Clicked** "Create"
- [ ] **Found** the REST API section in database dashboard
- [ ] **Copied** `UPSTASH_REDIS_REST_URL`
- [ ] **Copied** `UPSTASH_REDIS_REST_TOKEN`

## ☑️ Local Project Setup

- [ ] **Opened** terminal/command prompt
- [ ] **Navigated** to project: `cd /Users/craigvanslyke/Documents/PythonProjects/TimeFinder`
- [ ] **Verified** `.env.local` file exists
- [ ] **Opened** `.env.local` in text editor
- [ ] **Pasted** your `UPSTASH_REDIS_REST_URL`
- [ ] **Pasted** your `UPSTASH_REDIS_REST_TOKEN`
- [ ] **Saved** the `.env.local` file

### Your `.env.local` should look like:

```bash
KV_REST_API_URL=https://usw1-xxxxx-xxxxx.upstash.io
KV_REST_API_TOKEN=AYCgASQgMmJhN... (long string)
```

## ☑️ Install & Run

- [ ] **Ran** `npm install` (if not done yet)
- [ ] **Ran** `npm run dev`
- [ ] **Saw** message: "Local: http://localhost:3000"
- [ ] **Opened** browser to http://localhost:3000
- [ ] **Saw** TimeFinder homepage

## ☑️ Test the App

- [ ] **Clicked** "Create a Poll" button
- [ ] **Entered** poll title (e.g., "Test Meeting")
- [ ] **Added** 2-3 time slots with dates/times
- [ ] **Clicked** "Create Poll"
- [ ] **Redirected** to poll page (URL: `/poll/xxxxx`)
- [ ] **Entered** your name
- [ ] **Selected** some time slots
- [ ] **Clicked** "Submit Availability"
- [ ] **Saw** results page with your response

## ☑️ Verify in Upstash Console

- [ ] **Went back** to console.upstash.com
- [ ] **Clicked** on your database
- [ ] **Clicked** "Data Browser" tab
- [ ] **Saw** key starting with `poll:`
- [ ] **Clicked** the key to see stored data

## ☑️ All Working!

If all checkboxes are checked, your local setup is complete! 🎉

---

## 🚨 Troubleshooting

### Can't find `.env.local`?

Create it manually in the project root:

```bash
# In terminal, from project directory:
touch .env.local
```

Then open it and add your credentials.

### App won't start?

Try:
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### Still having issues?

Check these files:
- `UPSTASH_SETUP.md` - Detailed Upstash guide
- `QUICKSTART.md` - Full setup instructions
- `README.md` - General documentation

Or describe the error you're seeing!
