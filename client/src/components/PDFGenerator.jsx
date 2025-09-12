import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font
} from "@react-pdf/renderer";

// 1️⃣ Register Bangla font
Font.register({
  family: "NotoSansBengali",
  src: "/fonts/NotoSansBengali-Regular.ttf" // Put TTF file in public/fonts/
});

// 2️⃣ Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "NotoSansBengali",
    fontSize: 12
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5
  },
  text: {
    marginBottom: 10,
    fontSize: 12
  },
  englishText: {
    fontFamily: "Helvetica" // Default English font
  },
  banglaText: {
    fontFamily: "NotoSansBengali"
  }
});

// 3️⃣ PDF Document component
const MyPDF = ({ englishText, banglaText }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 10 }}>
        Multilingual PDF Document
      </Text>
      <View style={{ borderBottom: "1px solid #6496c8", marginBottom: 10 }} />

      {/* English Section */}
      <Text style={styles.sectionTitle}>English Section:</Text>
      <Text style={{ ...styles.text, ...styles.englishText }}>{englishText}</Text>

      {/* Bangla Section */}
      <Text style={styles.sectionTitle}>Bangla Section:</Text>
      <Text style={{ ...styles.text, ...styles.banglaText }}>{banglaText}</Text>

      {/* Mixed Content */}
      <Text style={styles.sectionTitle}>Mixed Content:</Text>
      <Text style={{ ...styles.text, ...styles.englishText }}>English: {englishText}</Text>
      <Text style={{ ...styles.text, ...styles.banglaText }}>Bangla: {banglaText}</Text>

      {/* Footer */}
      <Text style={{ fontSize: 10, textAlign: "center", marginTop: 20, color: "#646464" }}>
        Generated with React and @react-pdf/renderer
      </Text>
    </Page>
  </Document>
);

// 4️⃣ React Component
const PDFGenerator = () => {
  const [englishText, setEnglishText] = useState(
    "This is sample English text for demonstration."
  );
  const [banglaText, setBanglaText] = useState(
    "এটি একটি নমুনা বাংলা পাঠ্য যা প্রদর্শনের জন্য ব্যবহার করা হচ্ছে।"
  );

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ color: "#2c3e50", textAlign: "center" }}>
        PDF Generator with Bangla & English Support
      </h2>

      <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="englishText" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            English Text:
          </label>
          <textarea
            id="englishText"
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
            style={{ width: "100%", padding: 12, minHeight: 80, border: "1px solid #ddd", borderRadius: 4, fontSize: 16, fontFamily: "Arial, sans-serif" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="banglaText" style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Bangla Text:
          </label>
          <textarea
            id="banglaText"
            value={banglaText}
            onChange={(e) => setBanglaText(e.target.value)}
            style={{ width: "100%", padding: 12, minHeight: 80, border: "1px solid #ddd", borderRadius: 4, fontSize: 16, fontFamily: '"Noto Sans Bengali", Arial, sans-serif' }}
          />
        </div>

        <PDFDownloadLink
          document={<MyPDF englishText={englishText} banglaText={banglaText} />}
          fileName="multilingual-document.pdf"
          style={{
            padding: "12px 24px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "bold",
            display: "block",
            width: "100%",
            textAlign: "center",
            textDecoration: "none"
          }}
        >
          {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default PDFGenerator;
