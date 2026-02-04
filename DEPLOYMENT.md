# Deployment Guide

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/timefinder.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Set Up Upstash Redis

**Option A: Via Vercel Marketplace (Easiest)**

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Upstash Redis" from the marketplace
4. Click "Continue" and follow the prompts
5. The environment variables (`KV_REST_API_URL` and `KV_REST_API_TOKEN`) will be automatically added to your project

**Option B: Manual Setup**

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Sign up or log in
3. Create a new Redis database (select the region closest to your Vercel deployment)
4. Copy the REST API credentials
5. In Vercel, go to your project → Settings → Environment Variables
6. Add:
   - `KV_REST_API_URL`: Your Upstash REST URL
   - `KV_REST_API_TOKEN`: Your Upstash REST token

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app is live! 🎉

## Testing the Deployment

1. Visit your deployed URL (e.g., `https://timefinder.vercel.app`)
2. Create a test poll with 2-3 time slots
3. Share the link and add responses
4. Check the results page

## Environment Variables Reference

Required environment variables:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `KV_REST_API_URL` | Upstash Redis REST URL | Upstash Dashboard → Database → REST API |
| `KV_REST_API_TOKEN` | Upstash Redis REST token | Upstash Dashboard → Database → REST API |

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node.js version is 18 or higher
- Check build logs in Vercel dashboard

### Database Connection Errors

- Verify environment variables are set correctly
- Check Upstash Redis is in the same region as your Vercel deployment
- Confirm the database is active in Upstash console

### Timezone Issues

- Times should automatically convert based on user's browser timezone
- All times are stored as UTC in the database
- Check browser console for any JavaScript errors

## Custom Domain (Optional)

1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. SSL certificate will be provisioned automatically

## Monitoring

- View deployment logs in Vercel dashboard
- Monitor Redis usage in Upstash console
- Set up alerts for quota limits in Upstash

## Updating the App

1. Make changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your update description"
git push
```
3. Vercel will automatically deploy the changes

## Free Tier Limits

**Vercel (Hobby)**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution time limits

**Upstash Redis (Free)**
- 10,000 commands/day
- 256 MB storage
- Perfect for testing and small-scale use

For production use with high traffic, consider upgrading to paid tiers.
