import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { pdf, Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { API_BASE_URL } from "../../utils/api";

// Register Bengali font
// Font.register({
//   family: "NotoSansBengali",
//   src: "/fonts/NotoSansBengali-Regular.ttf",
//   fonts: [
//     { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: "normal" },
//     { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: "normal" },
//   ]
// });

//kalpurush bangla font
// Font.register({
//   family: "Kalpurush",
//   src: "/fonts/kalpurush.ttf",
//   fonts: [
//     { src: "/fonts/kalpurush.ttf", fontWeight: "normal" },
//     { src: "/fonts/kalpurush.ttf", fontWeight: "bold" },
//   ]
// });

//kalpurush bangla font
Font.register({
  family: "SolaimanLipi",
  // src: "/fonts/SolaimanLipi.ttf",
  fonts: [
    { src: "/fonts/SolaimanLipi.ttf", fontWeight: "normal" },
    { src: "/fonts/SolaimanLipi_Bold.ttf", fontWeight: "bold" },
  ]
});

export default function ViewCreatedExam() {
  const { examId } = useParams();
  const { token } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId) fetchExamDetails();
    else { setError("Exam ID is missing"); setLoading(false); }
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/examiner/my-created-exams/view-created-exam/${examId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "success") setExam(response.data.exam);
      else setError(response.data.message || "Failed to fetch exam details");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch exam details");
    } finally {
      setLoading(false);
    }
  };


const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "SolaimanLipi", fontSize: 12 },
  header: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subHeader: { fontSize: 12, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  details: { fontSize: 10, marginBottom: 10, flexDirection: "row", flexWrap: "wrap" },
  detailItem: { marginRight: 15, marginBottom: 3 },
  questionText: { fontWeight: "bold", marginBottom: 4 },
  option: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  optionLetter: { fontWeight: "bold", marginRight: 4 },
  answer: { color: "green", marginTop: 4, fontWeight: "bold" },

  // Image handling
  image: { marginVertical: 6, width: 250, height: 150, objectFit: "contain", borderRadius: 5 }, // fixed size
  smallImage: { marginVertical: 4, width: 120, height: 80, objectFit: "contain", borderRadius: 3 },
  hr: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 8 },
});

// Split into pages (define max questions per page)
const getPages = (questions, questionsPerPage = 6) => {
  const pages = [];
  for (let i = 0; i < questions.length; i += questionsPerPage) {
    pages.push(questions.slice(i, i + questionsPerPage));
  }
  return pages;
};

const exportPDF = async (includeAnswers = false) => {
  if (!exam) return;
  const pages = getPages(exam.questions, 6); // 6 questions per page

  const ExamDocument = (
    <Document>
      {pages.map((pageQuestions, pageIndex) => (
        <Page key={pageIndex} style={styles.page}>
          {pageIndex === 0 && (
            <>
              <Text style={styles.header}>{exam.exam_name}</Text>
              <Text style={styles.subHeader}>
                {exam.subject} - {exam.chapter}
              </Text>
              <View style={styles.details}>
                <Text style={styles.detailItem}>Class: {exam.class_name || "N/A"}</Text>
                <Text style={styles.detailItem}>Marks: {exam.total_marks}</Text>
                <Text style={styles.detailItem}>Time: {exam.total_time_minutes} min</Text>
                {exam.negative_marks_value > 0 && (
                  <Text style={styles.detailItem}>Negative: {exam.negative_marks_value}</Text>
                )}
                <Text style={styles.detailItem}>Attempts: {exam.attempts_allowed}</Text>
                <Text style={styles.detailItem}>Questions: {exam.questions.length}</Text>
              </View>
              {exam.description && (
                <Text style={{ marginBottom: 10 }}>Instructions: {exam.description}</Text>
              )}
              <View style={styles.hr} />
            </>
          )}

          {/* Single column questions */}
          {pageQuestions.map((q, idx) => (
            <View key={q.question_id} style={{ marginBottom: 15 }}>
              <Text style={styles.questionText}>
                {idx + 1 + pageIndex * 6}. {q.question_text}
              </Text>

              {/* Question image */}
              {q.question_image_url && (
                <Image src={q.question_image_url} style={styles.image} />
              )}

              {/* Options */}
              {["A", "B", "C", "D"].map((letter) => (
                <View key={letter} style={styles.option}>
                  <Text style={styles.optionLetter}>{letter}.</Text>
                  <Text>{q.options[letter].text}</Text>
                  {q.options[letter].image_url && (
                    <Image src={q.options[letter].image_url} style={styles.smallImage} />
                  )}
                </View>
              ))}

              {includeAnswers && (
                <Text style={styles.answer}>✓ Answer: {q.correct_answer}</Text>
              )}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );

  const asPdf = pdf();
  asPdf.updateContainer(ExamDocument);
  const blob = await asPdf.toBlob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = includeAnswers
    ? `${exam.exam_name.replace(/\s+/g, "_")}_With_Answers.pdf`
    : `${exam.exam_name.replace(/\s+/g, "_")}_Question_Paper.pdf`;
  link.click();
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <p className="text-gray-600 text-lg mb-6">{error || "Exam not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300 flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-8 pt-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Exams
          </button>

          {/* Edit button at top-right */}
          <button
            onClick={() => navigate(`/examiner/my-created-exam/edit-created-exam/${examId}`)}
            className="absolute top-10 right-0 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center transition duration-300"
          >
            <Edit size={18} className="mr-2" />
            Edit Exam
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {exam.exam_name}
          </h1>
          <p className="text-gray-600 text-lg">{exam.description || "No description provided"}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Subject: {exam.subject}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Chapter: {exam.chapter}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Class: {exam.class_name || "N/A"}
            </span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              Marks: {exam.total_marks}
            </span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
              Time: {exam.total_time_minutes} min
            </span>
            {exam.negative_marks_value > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Negative: {exam.negative_marks_value}
              </span>
            )}
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              Attempts: {exam.attempts_allowed}
            </span>
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
              Questions: {exam.questions.length}
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {exam.questions.map((q, idx) => (
            <div key={q.question_id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-lg p-2 mr-3">{idx + 1}.</span>
                {q.question_text}
              </h3>

              {/* Question Image */}
              {q.question_image_url && (
                <div className="ml-11 mb-4">
                  <div className="flex items-center mb-2">
                    {/* <ImageIcon size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-500">Question Image:</span> */}
                  </div>
                  <img
                    src={q.question_image_url}
                    alt="Question"
                    className="max-w-full h-auto rounded-lg border border-gray-200 max-h-60 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="ml-11 mb-4">
                <ul className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <li key={letter} className="flex items-start">
                      <span className="bg-gray-100 text-gray-700 rounded-lg p-1 px-2 mr-3 font-medium min-w-[2rem] text-center">
                        {letter}
                      </span>
                      <div className="flex-1">
                        <span className="text-gray-700">{q.options[letter].text}</span>
                        {q.options[letter].image_url && (
                          <div className="mt-2">
                            <div className="flex items-center mb-1">
                              {/* <ImageIcon size={14} className="text-blue-500 mr-1" />
                              <span className="text-xs text-gray-500">Option Image:</span> */}
                            </div>
                            <img
                              src={q.options[letter].image_url}
                              alt={`Option ${letter}`}
                              className="max-w-full h-auto  max-h-40 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ml-11 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-semibold flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-lg p-1 px-2 mr-3">✓</span>
                  Correct Answer: {q.correct_answer}
                </p>
                {/* <p className="text-green-600 text-sm mt-1">
                  Marks: {q.marks}
                </p> */}
              </div>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Download size={20} className="mr-2 text-blue-600" />
            Export Exam
          </h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => exportPDF(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition duration-300 flex items-center cursor-pointer"
            >
              <Download size={18} className="mr-2" />
              Questions Only PDF
            </button>

            <button
              onClick={() => exportPDF(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-5 py-3 rounded-xl shadow-md transition duration-300 flex items-center cursor-pointer"
            >
              <Download size={18} className="mr-2" />
              With Answers PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}