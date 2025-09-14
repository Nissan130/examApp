import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data - replace with actual API call
const mockLeaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "John Smith",
    score: 98,
    correctAnswers: 49,
    wrongAnswers: 1,
    timeTaken: "25:30",
    exam: "Mathematics Final",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    rank: 2,
    name: "Sarah Johnson",
    score: 95,
    correctAnswers: 47,
    wrongAnswers: 2,
    unanswered: 1,
    timeTaken: "28:15",
    exam: "Mathematics Final",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    rank: 3,
    name: "Mike Chen",
    score: 92,
    correctAnswers: 46,
    wrongAnswers: 3,
    unanswered: 1,
    timeTaken: "22:45",
    exam: "Mathematics Final",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    rank: 4,
    name: "Emily Davis",
    score: 88,
    correctAnswers: 44,
    wrongAnswers: 4,
    unanswered: 2,
    timeTaken: "30:20",
    exam: "Mathematics Final",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    rank: 5,
    name: "Alex Rodriguez",
    score: 85,
    correctAnswers: 42,
    wrongAnswers: 5,
    unanswered: 3,
    timeTaken: "26:10",
    exam: "Mathematics Final",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  }
];

export default function ExamineeLeaderBoard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedExam, setSelectedExam] = useState("Mathematics Final");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/examinee/leaderboard');
        // const data = await response.json();
        setTimeout(() => {
          setLeaderboardData(mockLeaderboardData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white";
      case 2: return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case 3: return "bg-gradient-to-r from-amber-700 to-amber-800 text-white";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Loading Leaderboard</h1>
            <p className="text-gray-600">Fetching the latest results...</p>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-12">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Leaderboard</h1>
          
          {/* Exam Filter */}
        
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rank
              </div>
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Examinee
              </div>
              <div className="col-span-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Score
              </div>
              <div className="col-span-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Performance
              </div>
              <div className="col-span-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Time
              </div>
            </div>
          </div>

          {/* Leaderboard Items */}
          <div className="divide-y divide-gray-100">
            {leaderboardData.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-blue-50/50 transition-colors duration-200"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(item.rank)}`}>
                      {getRankIcon(item.rank)}
                    </div>
                  </div>

                  {/* Examinee Info */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.exam}</div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {item.score}%
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="col-span-3">
                    <div className="flex justify-center space-x-3 text-xs">
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">{item.correctAnswers}</div>
                        <div className="text-gray-500">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-semibold">{item.wrongAnswers}</div>
                        <div className="text-gray-500">Wrong</div>
                      </div>
                      {item.unanswered && (
                        <div className="text-center">
                          <div className="text-gray-600 font-semibold">{item.unanswered}</div>
                          <div className="text-gray-500">Missed</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Taken */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.timeTaken}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            Go Back
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{leaderboardData.length}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(leaderboardData.reduce((sum, item) => sum + item.score, 0) / leaderboardData.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-amber-600">{leaderboardData[0]?.score}%</div>
            <div className="text-sm text-gray-600">Top Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}