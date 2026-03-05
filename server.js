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

// Main server for Render's HTTPS proxy
const PORT = process.env.PORT || 10000;
createServer().listen(PORT, '0.0.0.0', () => {
  console.log(`Main server running on port ${PORT}`);
});

// Second server on port 80 for plain HTTP from Simcon
createServer().listen(80, '0.0.0.0', () => {
  console.log('HTTP server running on port 80 for Simcon');
});
```

---

**Step 3 — Save (commit) the file**

Scroll down, leave the default commit message, click **Commit changes**.

---

**Step 4 — Wait for Render to redeploy**

Go to your Render dashboard at `https://dashboard.render.com`. You will see your `gps-server` service automatically start redeploying. Wait for the green **Live** status — takes about 1-2 minutes.

---

**Step 5 — Test HTTP on port 80**

Once redeployed, test this in your browser:
```
http://gps-server-noqx.onrender.com/update?lat=12.9716&lng=77.5946
```
No port number needed this time — port 80 is the default for HTTP.

Then verify it saved:
```
https://gps-server-noqx.onrender.com/location
