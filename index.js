import "./css/Index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./components/AppProvider";
import PetProvider from "./components/PetProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </AppProvider>
  </BrowserRouter>
);
