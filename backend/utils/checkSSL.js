import https from "https";

export default function checkSSL(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);

      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        method: "GET",
        rejectUnauthorized: false, // allow checking without blocking
      };

      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();

        if (!cert || !cert.valid_to) {
          resolve({ valid: false, expiry: null });
          return;
        }

        const expiry = new Date(cert.valid_to);
        const now = new Date();

        resolve({
          valid: expiry > now,
          expiry,
        });
      });

      req.on("error", () => {
        resolve({ valid: false, expiry: null });
      });

      req.end();
    } catch (error) {
      resolve({ valid: false, expiry: null });
    }
  });
}
