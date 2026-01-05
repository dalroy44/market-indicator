require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
var KiteConnect = require("kiteconnect").KiteConnect;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'market-indicator-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

const apiKey = process.env.KITE_API_KEY;
const apiSecret = process.env.KITE_API_SECRET;

const kite = new KiteConnect({
    api_key: apiKey
});

// Login Route
app.get('/login', (req, res) => {
    if (!apiKey) return res.status(500).send("API Key missing");
    const loginUrl = kite.getLoginURL();
    res.redirect(loginUrl);
});

// Callback Route
app.get('/callback', (req, res) => {
    const requestToken = req.query.request_token;
    if (!requestToken) return res.status(400).send("Token missing");

    kite.generateSession(requestToken, apiSecret)
        .then((response) => {
            console.log("Session generated");
            req.session.accessToken = response.access_token;
            // Optionally persist this token or session
            res.redirect('http://localhost:5173/'); 
        })
        .catch((err) => {
            console.error("Login failed", err);
            res.status(500).send("Login failed");
        });
});

// Dashboard Data Route
app.get('/api/dashboard-data', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    kite.setAccessToken(req.session.accessToken);

    try {
        // Fetch Holdings and Nifty Quote
        // keeping getQuote for detail
        const [holdings, quotes] = await Promise.all([
            kite.getHoldings(),
            kite.getQuote(["NSE:NIFTY 50"])
        ]);

        // Calculate Portfolio Day P&L
        let totalDayPnL = 0;
        if (holdings) {
            totalDayPnL = holdings.reduce((sum, h) => {
                 const dayPnL = (h.last_price - h.close_price) * h.quantity;
                 return sum + dayPnL;
            }, 0);
        }

        const niftyQuote = quotes["NSE:NIFTY 50"];
        const niftyChange = niftyQuote.net_change; // or whatever field provides change
        // Checking Kite Docs locally if I could... but assuming net_change or calculating it.
        // Quote usually has `last_price` and `ohlc.close`. 
        const niftyChangePercent = ((niftyQuote.last_price - niftyQuote.ohlc.close) / niftyQuote.ohlc.close) * 100;

        res.json({
            index: {
                instrument: "NSE:NIFTY 50",
                last_price: niftyQuote.last_price,
                change_percent: niftyChangePercent
            },
            portfolio: {
                day_pnl: totalDayPnL,
                is_positive: totalDayPnL >= 0
            }
        });

    } catch (err) {
        console.error("Data fetch error", err);
        // Handle session expiry
        if (err.status === 403) {
             return res.status(401).json({ error: "Session expired" });
        }
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
