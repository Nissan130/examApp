import { Link } from "react-router-dom";

export default function ExaminerDashboard() {
  const actions = [
    { title: "Create New Exam", link: "/examiner/create-exam", color: "bg-green-500 hover:bg-green-600" },
    { title: "Created Exams", link: "/examiner/all-created-exam", color: "bg-blue-500 hover:bg-blue-600" },
    // { title: "PDF Generator", link: "/examiner/pdf-generator", color: "bg-red-500 hover:bg-blue-600" },
    // { title: "View Results", link: "/examiner/results", color: "bg-purple-500 hover:bg-purple-600" },
    // { title: "Manage Questions", link: "/examiner/questions", color: "bg-yellow-500 hover:bg-yellow-600" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-28 px-4 md:px-8 min-h-screen sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-orange-600">Examiner Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className={`${action.color} text-white font-semibold py-4 px-6 rounded-xl shadow-lg text-center transition transform hover:scale-105`}
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
