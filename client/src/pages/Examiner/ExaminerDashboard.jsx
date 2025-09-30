import { Link } from "react-router-dom";

export default function ExaminerDashboard() {
  const actions = [
    { 
      title: "Create New Exam", 
      link: "/examiner/create-exam", 
      description: "Design and configure a new examination",
      icon: "📝",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
      borderColor: "border-teal-200"
    },
    { 
      title: "Created Exams", 
      link: "/examiner/all-created-exam", 
      description: "View and manage your existing exams",
      icon: "📋",
      color: "from-cyan-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-cyan-50 to-teal-50",
      borderColor: "border-cyan-200"
    },
    { 
      title: "Exam Analytics", 
      link: "/examiner/analytics", 
      description: "Track performance and insights",
      icon: "📊",
      color: "from-teal-600 to-cyan-700",
      bgColor: "bg-gradient-to-br from-teal-100 to-cyan-100",
      borderColor: "border-teal-300"
    },
    { 
      title: "Question Bank", 
      link: "/examiner/question-bank", 
      description: "Manage your question library",
      icon: "💭",
      color: "from-cyan-600 to-teal-700",
      bgColor: "bg-gradient-to-br from-cyan-100 to-teal-100",
      borderColor: "border-cyan-300"
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pt-28 pb-12  px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Examiner Dashboard
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
          Manage your examinations, track performance, and create comprehensive assessments with our professional exam management tools.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Link
              key={action.title}
              to={action.link}
              className="group"
            >
              <div className={`${action.bgColor} rounded-3xl p-6 shadow-xl border ${action.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-teal-400 group-hover:border-teal-500`}>
                {/* Icon Container with Gradient */}
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="text-2xl text-white">
                    {action.icon}
                  </div>
                </div>
                
                {/* Title with Gradient Text */}
                <h3 className={`text-xl font-semibold bg-gradient-to-r ${action.color} bg-clip-text text-transparent mb-3`}>
                  {action.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {action.description}
                </p>
                
                {/* Action Indicator */}
                <div className="flex items-center text-teal-700 font-medium text-sm group-hover:text-teal-800 transition-colors duration-200">
                  Get started
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>


      </div>
    </div>
  );
}