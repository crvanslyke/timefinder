# TimeFinder

A simple meeting scheduling app (like Doodle) built with Next.js 14 for Vercel deployment.

## Features

- 📅 Create polls with multiple time slot options
- 👥 Participants enter their name and select available times
- 🌍 Automatic timezone handling (store UTC, display in user's local timezone)
- 📊 View aggregated availability results
- ⏰ Temporary storage (14-day expiration) using Upstash Redis
- 🎨 Clean, responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Upstash Redis (via Vercel KV integration)
- **Styling**: Tailwind CSS
- **Timezone Handling**: Day.js with timezone plugin
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Upstash Redis database (get one free at [console.upstash.com](https://console.upstash.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timefinder.git
cd timefinder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Upstash Redis credentials:
```
KV_REST_API_URL=your_upstash_redis_rest_url
KV_REST_API_TOKEN=your_upstash_redis_rest_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/timefinder)

### Manual Deploy

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add an Upstash Redis integration from the Vercel Marketplace:
   - In your Vercel project, go to the "Storage" tab
   - Click "Create Database" and select "Upstash Redis"
   - Follow the prompts to create a new database
   - The environment variables will be automatically configured

4. Deploy!

## How It Works

### Creating a Poll

1. Go to `/create`
2. Enter a poll title and optional description
3. Add multiple time slots (date + time)
4. Times are automatically converted from your local timezone to UTC for storage
5. Share the generated link with participants

### Participating in a Poll

1. Open the shared poll link
2. Enter your name
3. Select all time slots when you're available
4. Times are displayed in your local timezone
5. Submit your availability

### Viewing Results

1. Go to `/poll/[id]/results` or click "View Results" from the poll page
2. See aggregated availability for all time slots
3. Best times (with most availability) are highlighted
4. View which participants are available for each slot

## Data Storage

- Polls are stored in Upstash Redis with a 14-day TTL (time-to-live)
- All times are stored as UTC ISO 8601 strings
- Times are converted to the viewer's local timezone on display
- Participant responses update the poll data atomically

## Project Structure

```
timefinder/
├── app/
│   ├── api/
│   │   └── poll/
│   │       ├── route.ts              # POST: Create poll
│   │       └── [id]/
│   │           ├── route.ts          # GET: Fetch poll
│   │           └── respond/
│   │               └── route.ts      # POST: Submit availability
│   ├── create/
│   │   └── page.tsx                  # Poll creation form
│   ├── poll/
│   │   └── [id]/
│   │       ├── page.tsx              # Voting interface
│   │       └── results/
│   │           └── page.tsx          # Results view
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── lib/
│   └── redis.ts                      # Redis client & data models
└── package.json
```

## License

MIT
