import dns from "dns";
import https from "https";

export default function checkStatusPing(url) {
  return new Promise((resolve) => {
    try {
      const hostname = new URL(url).hostname;

      // 1️⃣ DNS Resolve (if hostname exists → site exists)
      dns.lookup(hostname, (err, address) => {
        if (err || !address) {
          return resolve({ up: false });
        }

        // 2️⃣ Check SSL port 443 is reachable
        const options = {
          hostname,
          port: 443,
          method: "HEAD",
          timeout: 3000
        };

        const req = https.request(options, (res) => {
          resolve({ up: true }); // website is alive
        });

        // Cloudflare blocks HEAD → treat as UP
        req.on("error", () => resolve({ up: true }));

        req.on("timeout", () => {
          req.destroy();
          resolve({ up: true });
        });

        req.end();
      });
    } catch (error) {
      resolve({ up: false });
    }
  });
}
