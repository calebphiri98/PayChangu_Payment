import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function AccessGranted() {
  const [status, setStatus] = useState("checking"); // checking | success | failed

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txRef = params.get("tx_ref");

    if (!txRef) {
      setStatus("failed");
      return;
    }

    fetch(`${API_BASE_URL}/api/verify-payment/${txRef}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status === "success" ? "success" : "failed");
        // On success, this is where you'd unlock account-linking for the user.
      })
      .catch(() => setStatus("failed"));
  }, []);

  const message = {
    checking: "Confirming your payment...",
    success: "Payment successful — you're in!",
    failed: "We couldn't confirm your payment. Please try again.",
  }[status];

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1>{message}</h1>
    </div>
  );
}
