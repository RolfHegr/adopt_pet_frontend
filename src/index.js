import "./css/Index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import AppProvider from "./components/AppProvider";
import PetProvider from "./components/PetProvider";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </AppProvider>
  </BrowserRouter>
);
