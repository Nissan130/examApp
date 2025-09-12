import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GlobalProvider } from "./context/GlobalContext.jsx"; // import the provider
import { CustomAlertProvider } from "./context/CustomAlertContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomAlertProvider>
    <GlobalProvider>
      
        <App />
      
    </GlobalProvider>
    </CustomAlertProvider>
  </React.StrictMode>
);
