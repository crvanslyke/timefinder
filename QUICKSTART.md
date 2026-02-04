# Quick Start Guide

Get TimeFinder running locally in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- An Upstash Redis account (free at [console.upstash.com](https://console.upstash.com/))

## Local Development Setup

### 1. Get Upstash Redis Credentials

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Sign up or log in
3. Click "Create Database"
4. Choose a name (e.g., "timefinder-dev")
5. Select a region close to you
6. Click "Create"
7. In the database dashboard, scroll to "REST API" section
8. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and paste your credentials:
```bash
KV_REST_API_URL=https://your-region.upstash.io
KV_REST_API_TOKEN=your_token_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit [http://localhost:3000](http://localhost:3000)

## Testing the App Locally

### Create Your First Poll

1. Click "Create a Poll" on the homepage
2. Enter a title like "Team Meeting"
3. Add 2-3 time slots by selecting dates and times
4. Click "Create Poll"

### Participate in the Poll

1. You'll be redirected to the poll page
2. Enter your name
3. Select the times you're available
4. Click "Submit Availability"

### View Results

1. You'll be redirected to the results page
2. See the aggregated availability
3. Best times are highlighted in green

### Share the Poll

1. Go back to the poll page using the browser back button or the "Add Your Availability" link
2. Click "Copy Link" to share with others
3. Anyone with the link can add their availability

## Common Issues

### Build fails with missing environment variables

Make sure `.env.local` exists and has both:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### Can't connect to Redis

- Check your credentials are correct in `.env.local`
- Verify the Upstash database is active in the console
- Try creating a new database in a different region

### Port 3000 already in use

Run on a different port:
```bash
npm run dev -- -p 3001
```

## Next Steps

Once your local setup is working:

1. **Deploy to Vercel**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. **Push to GitHub**: Share your code or create a backup
3. **Customize**: Modify the styling, add features, or adjust the expiration time

## File Structure

```
timefinder/
├── app/
│   ├── page.tsx              # Homepage
│   ├── create/               # Poll creation page
│   ├── poll/[id]/            # Voting and results pages
│   └── api/poll/             # API routes
├── lib/
│   └── redis.ts              # Database logic
└── .env.local                # Your credentials (DO NOT COMMIT)
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `KV_REST_API_URL` | Upstash Redis REST endpoint |
| `KV_REST_API_TOKEN` | Upstash Redis authentication token |

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint
```

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub if you encounter problems
