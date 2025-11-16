import express from "express";
import axios from "axios";
import checkSSL from "../utils/checkSSL.js";
import checkStatusPing from "../utils/checkStatusPing.js";
// import cron from "node-cron";
import Website from "../models/website.js";


const router = express.Router();
/* -----------------------------------------------------
   🔍 SSL CHECK FUNCTION
----------------------------------------------------- */
// const checkSSL = (url) => {
//   return new Promise((resolve) => {
//     try {
//       const req = https.request(url, (res) => {
//         const cert = res.socket.getPeerCertificate();

//         if (!cert || !cert.valid_to) {
//           resolve({ valid: false, expiry: null });
//           return;
//         }

//         const expiry = new Date(cert.valid_to);
//         const now = new Date();

//         if (expiry < now) {
//           resolve({ valid: false, expiry });
//         } else {
//           resolve({ valid: true, expiry });
//         }
//       });

//       req.on("error", () => {
//         resolve({ valid: false, expiry: null });
//       });

//       req.end();
//     } catch (error) {
//       resolve({ valid: false, expiry: null });
//     }
//   });
// };
// ✅ POST new website (check status before saving)
router.post("/", async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required" });
    }


const start = Date.now();
const statusResult = await checkStatusPing(url);
const end = Date.now();

let status = statusResult.up ? "up" : "down";
let responseTime = statusResult.up ? end - start : null;
    // let status = "down";
    // let responseTime = null;

    // const start = Date.now();
    // try {
    //   // Try to fetch the site
    //   await axios.get(url, { timeout: 5000 });
    //   const end = Date.now();
    //   responseTime = end - start;
    //   status = "up";
    // } catch (err) {
    //   status = "down";
    // }
    // 🔍 SSL Check
    const ssl = await checkSSL(url);  
    const newSite = new Website({
      name,
      url,
      status,
      responseTime,
      sslValid: ssl.valid,
      sslExpiry: ssl.expiry,
      lastChecked: new Date(),
    });

    await newSite.save();

    res.status(201).json(newSite);
  } catch (error) {
    console.error("Error adding website:", error);
    res.status(500).json({ message: "Error adding website", error });
  }
});


// ✅ GET all websites
router.get("/", async (req, res) => {
  try {
    const websites = await Website.find();
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching websites", error });
  }
});

// ✅ DELETE website by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Website.findByIdAndDelete(id);
    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting website", error });
  }
});

export default router;