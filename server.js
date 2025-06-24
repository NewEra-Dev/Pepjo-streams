require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy API requests to CoinGecko with extended timeout and error handling
app.use('/api', createProxyMiddleware({
  target: 'https://api.coingecko.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v3'
  },
  timeout: 10000,
  proxyTimeout: 12000,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});