import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PayPage from "./pages/PayPage";
import AccessGranted from "./pages/AccessGranted";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PayPage />} />
        <Route path="/access-granted" element={<AccessGranted />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
