

// Detect if we are in development (localhost) or production
const isDevelopment = window.location.hostname === "localhost";

// Set API base URL based on environment
export const API_BASE_URL = isDevelopment
  ? "http://127.0.0.1:5000" // Local Flask server
  : "https://exam-app-api-f5ge.onrender.com"; // Render deployment