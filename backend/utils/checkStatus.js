import https from "https";

export default function checkStatus(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);

      const options = {
        method: "HEAD",
        hostname: parsed.hostname,
        path: parsed.pathname,
        port: 443,
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        resolve({
          up: res.statusCode >= 200 && res.statusCode < 500
        });
      });

      req.on("error", () => {
        resolve({ up: false });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ up: false });
      });

      req.end();
    } catch (err) {
      resolve({ up: false });
    }
  });
}
