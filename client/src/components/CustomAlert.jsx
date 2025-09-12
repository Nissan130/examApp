import { useEffect, useState } from "react";
import { Check, X, AlertCircle, Info, Loader } from "lucide-react";

const CustomAlert = ({ type, message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const alertConfig = {
    success: {
      icon: Check,
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      iconColor: "text-green-600"
    },
    error: {
      icon: X,
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
      textColor: "text-red-700",
      iconColor: "text-red-600"
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-600"
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
      iconColor: "text-blue-600"
    },
    loading: {
      icon: Loader,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-400",
      textColor: "text-gray-700",
      iconColor: "text-gray-600"
    }
  };

  const config = alertConfig[type] || alertConfig.info;
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
        <IconComponent className={`h-5 w-5 mr-2 ${type === 'loading' ? 'animate-spin' : ''}`} />
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;