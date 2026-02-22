import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </BrowserRouter>
  </React.StrictMode>
);