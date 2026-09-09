require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SUCCESS_PATH = process.env.SUCCESS_PATH || "/access-granted";
const FAILURE_PATH = process.env.FAILURE_PATH || "/";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || FRONTEND_URL)
  .split(",")
  .map((s) => s.trim());

const PAYCHANGU_SECRET_KEY = (process.env.PAYCHANGU_SECRET_KEY || "").trim();

if (!PAYCHANGU_SECRET_KEY) {
  console.warn(
    "⚠️  PAYCHANGU_SECRET_KEY is not set. Copy .env.example to .env and add it."
  );
} else if (!PAYCHANGU_SECRET_KEY.startsWith("sec-")) {
  console.warn(
    "⚠️  This doesn't look like a PayChangu SECRET key (should start with 'sec-'). " +
    "Double check you copied the Secret Key, not the Public Key, from Settings > API Keys & Webhooks."
  );
}

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.post("/api/initiate-payment", async (req, res) => {
  const { amount, currency = "MWK", email, first_name, last_name } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: "amount and email are required" });
  }

  const tx_ref = crypto.randomUUID();

  try {
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        email,
        first_name,
        last_name,
        tx_ref,
        callback_url: `${FRONTEND_URL}${SUCCESS_PATH}`,
        return_url: `${FRONTEND_URL}${FAILURE_PATH}`,
        customization: {
          title: "Buffer Access",
          description: "Unlock account linking",
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      res.json({ checkout_url: data.data.checkout_url, tx_ref });
    } else {
      console.error("PayChangu initiate error:", JSON.stringify(data, null, 2));
      res.status(400).json({ error: data.message || "Failed to start payment", detail: data });
    }
  } catch (e) {
    console.error("Error initiating payment:", e.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

app.get("/api/verify-payment/:tx_ref", async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const response = await fetch(
      `https://api.paychangu.com/verify-payment/${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error("Error verifying payment:", e.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on ${BASE_URL}`);
  console.log(`Expecting frontend at ${FRONTEND_URL}`);
});
