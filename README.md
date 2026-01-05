# Market Indicator

A real-time dashboard for tracking NIFTY 50 and User Portfolio P&L using the Zerodha Kite Connect API. Built with Node.js (Express) and React (Vite).

## Features
- **Real-time Indices**: View live status of NIFTY 50 (Green/Red indicators).
- **Portfolio P&L**: Track daily Profit & Loss of your holdings.
- **Mobile Responsive**: Designed for mobile-first usage.
- **Stateless Auth**: Uses secure cookies for session management (compatible with Vercel/Serverless).

## Tech Stack
- **Backend**: Node.js, Express, Kite Connect, Cookie Session
- **Frontend**: React, Tailwind CSS, Vite
- **Deployment**: Configured for Vercel

## Local Development

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd market-indicator
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

2. **Environment Setup**
   Create `server/.env`:
   ```env
   KITE_API_KEY=your_kite_api_key
   KITE_API_SECRET=your_kite_api_secret
   PORT=3000
   ```
   *Note: In production (Vercel), add these as Environment Variables in the project settings.*

3. **Run Locally**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

## Deployment (Vercel)

1. **Push to Git**: Push this repository to GitHub/GitLab/Bitbucket.
2. **Import in Vercel**: Connect your repository.
3. **Environment Config**: Add `KITE_API_KEY` and `KITE_API_SECRET` in Vercel Project Settings.
4. **Deploy**: Vercel will automatically detect the configuration in `vercel.json` and deploy.

## License
Private Repository.
