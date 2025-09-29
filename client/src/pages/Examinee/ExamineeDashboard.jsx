import { Link } from "react-router-dom";

export default function ExamineeDashboard() {
  const actions = [
    { 
      title: "Join New Exam", 
      link: "/enter-exam-code", 
      type: "primary",
      icon: "⚡",
      description: "Enter exam code to start a new test"
    },
    { 
      title: "Completed Exams", 
      link: "/previous-attempt-exam", 
      type: "secondary",
      icon: "📊",
      description: "View your past exam results and performance"
    },
  ];

  const recentExams = [
    { name: "Mathematics Final", date: "2024-01-15", score: "85%", status: "completed" },
    { name: "Physics Midterm", date: "2024-01-10", score: "78%", status: "completed" },
    { name: "Chemistry Quiz", date: "2024-01-08", score: "92%", status: "completed" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Examinee Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Welcome back! Ready for your next exam?</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className={`group block p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  action.type === 'primary'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-700 border-transparent text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      action.type === 'primary' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      action.type === 'primary' ? 'text-teal-100' : 'text-slate-600'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Exams */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Exams</h2>
          <div className="space-y-4">
            {recentExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-teal-300 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{exam.name}</h3>
                    <p className="text-sm text-slate-600">{exam.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{exam.score}</p>
                  <p className="text-sm text-slate-600">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}