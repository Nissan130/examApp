// utils/pdfGenerator.js
import { Font } from '@react-pdf/renderer';

// Function to register Bengali fonts
export const registerBengaliFonts = async () => {
  try {
    // Load fonts using fetch API (browser-compatible)
    const fontResponse = await fetch('/fonts/NotoSansBengali-Regular.ttf');
    const fontBuffer = await fontResponse.arrayBuffer();
    
    // Convert ArrayBuffer to base64 for react-pdf
    const base64Font = arrayBufferToBase64(fontBuffer);
    
    Font.register({
      family: 'NotoSansBengali',
      src: base64Font,
      format: 'truetype',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to register Bengali fonts:', error);
    return false;
  }
};

// Helper function to convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:font/truetype;base64,${window.btoa(binary)}`;
};

// Function to detect if text contains Bengali characters
export const containsBengali = (text) => {
  if (!text) return false;
  // Bengali Unicode range: U+0980 to U+09FF
  return /[\u0980-\u09FF]/.test(text);
};