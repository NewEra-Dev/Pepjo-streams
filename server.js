require('dotenv').config();
const port = process.env.PORT || 3000;

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Serve static files (including rates.html)
app.use(express.static(__dirname));

// Proxy API requests to CoinGecko with extended timeout
app.use('/api', createProxyMiddleware({
  target: 'https://api.coingecko.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v3' // Maps /api/simple/price to /api/v3/simple/price
  },
  timeout: 10000, // 10 seconds
  proxyTimeout: 12000 // 12 seconds
}));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});