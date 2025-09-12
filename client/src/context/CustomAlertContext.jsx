import { createContext, useContext, useState } from "react";
import CustomAlert from "../components/CustomAlert";

const CustomAlertContext = createContext();

export const useCustomAlert = () => {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error("useCustomAlert must be used within a CustomAlertProvider");
  }
  return context;
};

export const CustomAlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, message, duration = 3000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message, duration }]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const custom_alert = {
    success: (message, duration) => showAlert("success", message, duration),
    error: (message, duration) => showAlert("error", message, duration),
    warning: (message, duration) => showAlert("warning", message, duration),
    info: (message, duration) => showAlert("info", message, duration),
    loading: (message, duration) => showAlert("loading", message, duration)
  };

  return (
    <CustomAlertContext.Provider value={custom_alert}>
      {children}
      {alerts.map(alert => (
        <CustomAlert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </CustomAlertContext.Provider>
  );
};
