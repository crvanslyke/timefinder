# Upstash Redis Setup Guide

## Step 1: Log into Upstash Console

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Log in with your account

## Step 2: Create a New Redis Database

1. On the dashboard, click the **"Create Database"** button (big green button)

2. Fill out the form:
   - **Name**: `timefinder-dev` (or any name you prefer)
   - **Type**: Select **Regional** (cheaper and fine for development)
   - **Region**: Choose the region **closest to you** or where you'll deploy (e.g., `us-east-1`, `eu-west-1`)
   - **TLS**: Leave enabled (recommended for security)
   - **Eviction**: Leave as default (not needed, we use TTL)

3. Click **"Create"**

## Step 3: Get Your Credentials

After creating the database, you'll see the database dashboard. Scroll down to find:

### REST API Section

You'll see two important values:

```
UPSTASH_REDIS_REST_URL
https://your-region-xxxxx.upstash.io

UPSTASH_REDIS_REST_TOKEN
AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ
```

**Important**: These are the credentials you need!

### How to Copy Them

There are usually **"Copy"** buttons next to each value. Click them to copy.

## Step 4: Add to Your Local Environment

1. Open your project in your code editor

2. Find the file `.env.local` in the root directory

3. Replace the placeholder values:

```bash
# Before (placeholders):
KV_REST_API_URL=https://example.upstash.io
KV_REST_API_TOKEN=example_token

# After (your real credentials):
KV_REST_API_URL=https://usw1-charming-mantis-12345.upstash.io
KV_REST_API_TOKEN=AYCgASQgMmJhNTYwOGMtODk3Yy00NTEyLWE5ZDItYmI0ZGM3MzE3OGJlxxxxxxxxQ
```

4. Save the file

## Step 5: Test the Connection

Run your development server:

```bash
npm run dev
```

Then:
1. Open http://localhost:3000
2. Click "Create a Poll"
3. Fill out the form with test data
4. Click "Create Poll"

If it works, you'll be redirected to the poll page! ✅

## Step 6: Verify Data in Upstash Console

Go back to your Upstash console:

1. Click on your database name
2. Click the **"Data Browser"** tab
3. You should see a key like: `poll:abc123xyz`
4. Click on it to see the stored poll data

## Troubleshooting

### Error: "KV_REST_API_URL and KV_REST_API_TOKEN must be defined"

**Problem**: Environment variables not loaded

**Solution**:
- Make sure `.env.local` exists in the root directory
- Restart your dev server (`Ctrl+C` then `npm run dev`)
- Check for typos in variable names (must be exact)

### Error: "Failed to create poll" or "500 Internal Server Error"

**Problem**: Wrong credentials or network issue

**Solution**:
- Double-check you copied the **REST API** credentials (not Redis connection string)
- Make sure there are no extra spaces in `.env.local`
- Verify the database is "Active" in Upstash console
- Try copying the credentials again

### Database shows "Inactive" or "Paused"

**Problem**: Free tier databases may pause after inactivity

**Solution**:
- Click the database in Upstash console
- It should auto-activate when you make a request
- Or click "Activate" if there's a button

## Alternative: Using Upstash Console Variables Tab

Upstash also shows credentials in different formats. If you can't find REST API:

1. Go to your database dashboard
2. Look for tabs: **Details**, **REST API**, **Redis**, etc.
3. Click **REST API** tab
4. You'll see the URL and Token there

## What the Credentials Look Like

**REST URL**:
- Format: `https://REGION-NAME-XXXXX.upstash.io`
- Example: `https://usw1-lucky-fish-12345.upstash.io`

**REST Token**:
- Format: Long alphanumeric string starting with `A` or `B`
- Example: `AYCgASQgMmJhN...` (about 100+ characters)

## Visual Guide

```
Upstash Console Dashboard
├── [Create Database] ← Click this first
│
├── Database: timefinder-dev
│   ├── Overview
│   ├── Data Browser ← Check your polls here
│   ├── REST API ← GET CREDENTIALS HERE
│   │   ├── UPSTASH_REDIS_REST_URL
│   │   └── UPSTASH_REDIS_REST_TOKEN
│   ├── Redis (CLI connection - not needed)
│   └── Settings
```

## Security Notes

- ✅ `.env.local` is in `.gitignore` - won't be committed
- ✅ Never share your token publicly
- ✅ Use different databases for dev/production
- ✅ Regenerate token if accidentally exposed

## Next Steps After Setup

Once your credentials are working:

1. Test creating multiple polls
2. Test voting on polls
3. Check the results page
4. View data in Upstash Data Browser
5. Deploy to Vercel (credentials will be different for production)

## Need Help?

If you're still stuck, share:
- What error message you see (screenshot)
- Which step you're on
- What the Upstash console shows

I can help debug!
