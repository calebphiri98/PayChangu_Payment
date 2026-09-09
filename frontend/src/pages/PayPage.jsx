import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/initiate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 20,
          currency: "MWK",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError(data.error || "Couldn't start payment. Try again.");
        setLoading(false);
      }
    } catch (e) {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1>Unlock Account Linking</h1>
      <p>Pay to link your Facebook, Instagram and Pinterest accounts.</p>
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          background: "#2c4bff",
          color: "white",
          border: "none",
          padding: "14px 28px",
          fontSize: 16,
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Redirecting..." : "Pay MK 50"}
      </button>
      {error && <p style={{ color: "#c00", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
