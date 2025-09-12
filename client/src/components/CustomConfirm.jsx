import { Trash2, AlertCircle, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) => {
  const dialogConfig = {
    danger: {
      icon: Trash2,
      iconColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700",
      accentColor: "bg-red-100",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      accentColor: "bg-yellow-100",
    },
    success: {
      icon: Check,
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      accentColor: "bg-green-100",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      accentColor: "bg-blue-100",
    },
  };

  const config = dialogConfig[type] || dialogConfig.danger;
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Semi-transparent overlay */}
          <div
            className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"
            onClick={onClose} // optional: close when clicking outside
          ></div>

          {/* Modal Card */}
          <motion.div
            className="relative bg-red-50 border border-cyan-400 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Icon */}
            <div className="text-center">
              <div
                className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full ${config.accentColor} mb-4`}
              >
                <IconComponent className={`h-7 w-7 ${config.iconColor}`} />
              </div>

              {/* Title & Message */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium 
                             hover:bg-gray-300 transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-5 py-2.5 ${config.buttonColor} text-white rounded-xl font-medium cursor-pointer
                              transition duration-200 disabled:opacity-50 flex items-center justify-center shadow-md`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
