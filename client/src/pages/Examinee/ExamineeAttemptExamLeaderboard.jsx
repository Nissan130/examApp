import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export default function ExamineeAttemptExamLeaderboard() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { token } = useContext(GlobalContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(examId);
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch exam details
        // const examResponse = await axios.get(
        //   `${API_BASE_URL}/api/exams/${examId}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // setExamDetails(examResponse.data.exam);

        // Fetch leaderboard data - CORRECTED ENDPOINT
        const leaderboardResponse = await axios.get(
          `${API_BASE_URL}/api/examinee/exams/${examId}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Handle different response structures
        const responseData = leaderboardResponse.data;
        if (responseData.leaderboard) {
          setLeaderboardData(responseData.leaderboard);
        } else if (Array.isArray(responseData)) {
          setLeaderboardData(responseData);
        } else {
          setLeaderboardData([]);
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again.");
        
        // Fallback to mock data if API fails
        setLeaderboardData(generateMockLeaderboardData());
      } finally {
        setIsLoading(false);
      }
    };

    if (examId && token) {
      fetchLeaderboardData();
    }
  }, [examId, token]);

  // Generate mock data as fallback
  const generateMockLeaderboardData = () => {
    return [
      {
        id: 1,
        rank: 1,
        name: "John Smith",
        score: 98,
        correct_answers: 49,
        wrong_answers: 1,
        unanswered_questions: 0,
        time_taken_minutes: 25,
        exam_name: examDetails?.exam_name || "Mathematics Final",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 2,
        rank: 2,
        name: "Sarah Johnson",
        score: 95,
        correct_answers: 47,
        wrong_answers: 2,
        unanswered_questions: 1,
        time_taken_minutes: 28,
        exam_name: examDetails?.exam_name || "Mathematics Final",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 3,
        rank: 3,
        name: "Mike Chen",
        score: 92,
        correct_answers: 46,
        wrong_answers: 3,
        unanswered_questions: 1,
        time_taken_minutes: 22,
        exam_name: examDetails?.exam_name || "Mathematics Final",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 4,
        rank: 4,
        name: "Emily Davis",
        score: 88,
        correct_answers: 44,
        wrong_answers: 4,
        unanswered_questions: 2,
        time_taken_minutes: 30,
        exam_name: examDetails?.exam_name || "Mathematics Final",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      {
        id: 5,
        rank: 5,
        name: "Alex Rodriguez",
        score: 85,
        correct_answers: 42,
        wrong_answers: 5,
        unanswered_questions: 3,
        time_taken_minutes: 26,
        exam_name: examDetails?.exam_name || "Mathematics Final",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
      }
    ];
  };

  const formatTime = (minutes) => {
    if (!minutes) return "0:00";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}` : `${mins}:00`;
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Leaderboard</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
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
          <p className="text-gray-600 mb-4">{examDetails?.exam_name || "Exam Results"}</p>
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
            {leaderboardData.length > 0 ? (
              leaderboardData.map((item) => (
                <div
                  key={item.id || item.attempt_id}
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
                        src={item.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"}
                        alt={item.name || item.examinee_name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{item.name || item.examinee_name}</div>
                        <div className="text-xs text-gray-500">{item.exam_name || examDetails?.exam_name}</div>
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
                          <div className="text-green-600 font-semibold">{item.correct_answers}</div>
                          <div className="text-gray-500">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-semibold">{item.wrong_answers}</div>
                          <div className="text-gray-500">Wrong</div>
                        </div>
                        {(item.unanswered_questions > 0) && (
                          <div className="text-center">
                            <div className="text-gray-600 font-semibold">{item.unanswered_questions}</div>
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
                        {formatTime(item.time_taken_minutes)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No leaderboard data available yet.</p>
              </div>
            )}
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
        {leaderboardData.length > 0 && (
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
        )}
      </div>
    </div>
  );
}