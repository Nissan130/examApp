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
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this useEffect to scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/examinee/attempt-exam/${exam_id}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setLeaderboardData(response.data.leaderboard);
          setExamDetails(response.data.exam);
          setCurrentUserRank(response.data.current_user_rank)
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
      case 1: return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg";
      case 2: return "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md";
      case 3: return "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md";
      default: return "bg-slate-100 text-slate-600 border border-slate-200";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Loading Leaderboard
            </h1>
            <p className="text-slate-600 text-lg">Fetching the latest results...</p>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-16 h-8 bg-slate-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 mt-15">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Leaderboard</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-12">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Exam Leaderboard
          </h1>
          <p className="text-xl text-slate-600 mb-2">{examDetails?.exam_name}</p>
          <p className="text-lg text-slate-500">
            {examDetails?.class_name} • {examDetails?.subject} • {examDetails?.chapter}
          </p>
        </div>

        {/* Stats Summary */}
        {leaderboardData.length > 0 && (
          <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-teal-300 transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-teal-600">{leaderboardData.length}</div>
              <div className="text-sm text-slate-600 font-semibold">Total Participants</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-teal-300 transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {Math.max(...leaderboardData.map(item => item.score))}
              </div>
              <div className="text-sm text-slate-600 font-semibold">Highest Marks</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-teal-300 transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-amber-600">{calculateLowestMarks()}</div>
              <div className="text-sm text-slate-600 font-semibold">Lowest Marks</div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 hover:border-teal-300 transition-all duration-300">
          {/* Table Header - Hidden on mobile */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200 hidden md:block">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Rank
              </div>
              <div className="col-span-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Examinee
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Marks
              </div>
              <div className="col-span-3 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Performance
              </div>
              <div className="col-span-2 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Time
              </div>
            </div>
          </div>

          {/* Leaderboard Items */}
          <div className="divide-y divide-slate-100">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((item) => (
                <div
                  key={item.attempt_exam_id}
                  className="px-6 py-4 hover:bg-teal-50/30 transition-all duration-300 group"
                >
                  {/* Mobile View */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${getRankBadgeColor(item.rank)} mr-4 shadow-sm`}>
                          {getRankIcon(item.rank)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-base">{item.examinee_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {item.score}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Marks</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                        <div className="text-xs text-slate-500 font-semibold mb-2">Performance</div>
                        <div className="flex space-x-4 text-xs">
                          <div className="text-center">
                            <div className="text-teal-600 font-bold text-sm">{item.correct_answers}</div>
                            <div className="text-slate-500">Correct</div>
                          </div>
                          <div className="text-center">
                            <div className="text-rose-600 font-bold text-sm">{item.wrong_answers}</div>
                            <div className="text-slate-500">Wrong</div>
                          </div>
                          {(item.unanswered_questions > 0) && (
                            <div className="text-center">
                              <div className="text-slate-600 font-bold text-sm">{item.unanswered_questions}</div>
                              <div className="text-slate-500">Unanswered</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                        <div className="text-xs text-slate-500 font-semibold mb-2">Time Taken</div>
                        <div className="flex items-center justify-center text-sm text-slate-600 font-medium">
                          <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(item.time_taken_seconds)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 md:gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold ${getRankBadgeColor(item.rank)} group-hover:scale-105 transition-transform duration-300`}>
                        {getRankIcon(item.rank)}
                      </div>
                    </div>

                    {/* Examinee Info */}
                    <div className="col-span-4 flex items-center space-x-4">
                      <div>
                        <div className="font-semibold text-slate-900 text-lg">{item.name || item.examinee_name}</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        {item.score}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="col-span-3">
                      <div className="flex justify-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-teal-600 font-bold text-lg">{item.correct_answers}</div>
                          <div className="text-slate-500 text-xs font-medium">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-rose-600 font-bold text-lg">{item.wrong_answers}</div>
                          <div className="text-slate-500 text-xs font-medium">Wrong</div>
                        </div>
                        {(item.unanswered_questions > 0) && (
                          <div className="text-center">
                            <div className="text-slate-600 font-bold text-lg">{item.unanswered_questions}</div>
                            <div className="text-slate-500 text-xs font-medium">Unanswered</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time Taken */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center text-base text-slate-600 font-medium">
                        <svg className="w-5 h-5 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(item.time_taken_seconds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-8 py-12 text-center">
                <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Leaderboard Data</h3>
                <p className="text-slate-500">No participants have completed this exam yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-bold text-lg"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-xl hover:scale-105 hover:shadow-xl hover:border-teal-300 transition-all duration-300 shadow-lg font-bold text-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}