const http = require('http');

let lastLocation = { lat: 0, lng: 0, timestamp: 'No data yet' };

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/update') {
      lastLocation = {
        lat: parseFloat(url.searchParams.get('lat')),
        lng: parseFloat(url.searchParams.get('lng')),
        timestamp: new Date().toISOString()
      };
      console.log('Location received:', lastLocation);
      res.end(JSON.stringify({ status: 'ok' }));

    } else if (url.pathname === '/location') {
      res.end(JSON.stringify(lastLocation));

    } else {
      res.end(JSON.stringify({ status: 'server running' }));
    }
  });
}

const PORT = process.env.PORT || 10000;
createServer().listen(PORT, '0.0.0.0', () => {
  console.log(`Main server running on port ${PORT}`);
});

createServer().listen(80, '0.0.0.0', () => {
  console.log('HTTP server running on port 80 for Simcon');
});
