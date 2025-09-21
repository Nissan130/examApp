import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export default function ExamineeAttemptExamLeaderboard() {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { token } = useContext(GlobalContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/examiner/taken-exam-result/${exam_id}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setLeaderboardData(response.data.leaderboard);
          setExamDetails(response.data.exam);
        } 
        else {
          setLeaderboardData([]);
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (exam_id && token) {
      fetchLeaderboardData();
    }
  }, [exam_id, token]);

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return "0:00";

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    else {
      if (minutes < 10) {
        return `0${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
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

  const calculateLowestMarks = () => {
    if (leaderboardData.length === 0) return 0;
    
    const sortedByScore = [...leaderboardData].sort((a, b) => a.score - b.score);
    return sortedByScore[0]?.score || 0;
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
          <div className="text-center mb-8 mt-15">
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
      <div className="max-w-4xl mx-auto mt-12">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Leaderboard</h1>
          <p className="text-gray-600 mb-4">{examDetails.exam_name} - {examDetails.class_name}</p>
          <p className="text-gray-600 mb-4">{examDetails.chapter} - {examDetails.subject}</p>
        </div>

        {/* Stats Summary */}
        {leaderboardData.length > 0 && (
          <div className="mt-8 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{leaderboardData.length}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...leaderboardData.map(item => item.score))}
              </div>
              <div className="text-sm text-gray-600">Highest Marks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-amber-600">{calculateLowestMarks()}</div>
              <div className="text-sm text-gray-600">Lowest Marks</div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 hidden md:block">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rank
              </div>
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Examinee
              </div>
              <div className="col-span-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Marks
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
                  key={item.attempt_exam_id}
                  className="px-4 py-3 hover:bg-blue-50/50 transition-colors duration-200"
                >
                  {/* Mobile View */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(item.rank)} mr-3`}>
                          {getRankIcon(item.rank)}
                        </div>
    
                          <div className="text-xs text-gray-500">{item.examinee_name}</div>
                       
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">
                          {item.score}
                        </div>
                        <div className="text-xs text-gray-500">Marks</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">Performance</div>
                        <div className="flex space-x-3 text-xs">
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
                              <div className="text-gray-500">Unanswered</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">Time Taken</div>
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(item.time_taken_seconds)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 md:gap-2 items-center">
                    {/* Rank */}
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(item.rank)}`}>
                        {getRankIcon(item.rank)}
                      </div>
                    </div>

                    {/* Examinee Info */}
                    <div className="col-span-4 flex items-center space-x-3">
                      <div>
                        <div className="font-semibold text-gray-800">{item.name || item.examinee_name}</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {item.score}
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
                            <div className="text-gray-500">Unanswered</div>
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
                        {formatTime(item.time_taken_seconds)}
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
        <div className="text-center mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="block sm:inline-block w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm mb-2 sm:mb-0"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="block sm:inline-block w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}