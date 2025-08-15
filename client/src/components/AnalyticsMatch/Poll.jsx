import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Poll({ team1, team2, startTime }) {
  const [poll, setPoll] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/poll`, {
          params: { team1, team2, startTime },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setPoll(response.data.poll);
        setUserVote(response.data.userVote);
      } catch (err) {
        console.error("Error fetching poll:", err);
        setError("Failed to load poll data");
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [team1, team2, startTime, token]);

  const handleVote = async (voteChoice) => {
    if (!token) {
      // Redirect to login or show login modal
      alert("Please log in to vote");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "/api/poll/vote",
        {
          team1,
          team2,
          startTime,
          voteChoice,
          pollId: poll?.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPoll(response.data.poll);
      setUserVote(response.data.userVote);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError("Failed to submit your vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6 text-gray-600 dark:text-gray-400">
        Loading poll...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-4">
        {error}
      </div>
    );
  }

  // Calculate percentages for the progress bars
  const totalVotes = (poll?.team1Votes || 0) + (poll?.team2Votes || 0);
  const team1Percentage =
    totalVotes > 0 ? Math.round((poll?.team1Votes / totalVotes) * 100) : 50;
  const team2Percentage =
    totalVotes > 0 ? Math.round((poll?.team2Votes / totalVotes) * 100) : 50;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 p-6 w-full mx-auto">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Who do you think will WIN?
      </h2>

      <div className="flex justify-between mb-4 gap-2">
        <div
          className={`flex-1 text-center px-3 py-3 rounded-l-lg transition-all cursor-pointer ${
            userVote === 1
              ? "bg-green-500 dark:bg-green-600 text-white font-bold"
              : "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50 text-gray-800 dark:text-gray-200"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isSubmitting && handleVote(1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              !isSubmitting && handleVote(1);
            }
          }}
        >
          <p className="font-medium">{team1}</p>
          <p className="text-sm mt-0.5 opacity-90">
            {poll?.team1Votes || 0} votes
          </p>
        </div>

        <div
          className={`flex-1 text-center px-3 py-3 rounded-r-lg transition-all cursor-pointer ${
            userVote === 2
              ? "bg-red-500 dark:bg-red-600 text-white font-bold"
              : "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-gray-800 dark:text-gray-200"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isSubmitting && handleVote(2)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              !isSubmitting && handleVote(2);
            }
          }}
        >
          <p className="font-medium">{team2}</p>
          <p className="text-sm mt-0.5 opacity-90">
            {poll?.team2Votes || 0} votes
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-green-500 dark:bg-green-600 transition-all duration-500 ease-in-out"
            style={{ width: `${team1Percentage}%` }}
          />
          <div
            className="bg-red-500 dark:bg-red-600 transition-all duration-500 ease-in-out"
            style={{ width: `${team2Percentage}%` }}
          />
        </div>
      </div>

      {/* Vote Statistics */}
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{team1Percentage}%</span>
        <span className="font-medium text-center">
          {totalVotes} total votes
        </span>
        <span className="font-medium">{team2Percentage}%</span>
      </div>

      {/* Login Prompt */}
      {!token && (
        <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <span className="font-medium">Log in to cast your vote!</span>
        </p>
      )}

      {/* User Vote Status */}
      {userVote && (
        <div className="text-center mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">
            You voted for{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {userVote === 1 ? team1 : team2}
            </span>
            .
          </p>
          <button
            className="text-blue-500 dark:text-blue-400 ml-1 cursor-pointer underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium"
            onClick={() => handleVote(userVote === 1 ? 2 : 1)}
            disabled={isSubmitting}
          >
            Change vote?
          </button>
        </div>
      )}

      {/* Submitting State */}
      {isSubmitting && (
        <div className="text-center mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
          Submitting your vote...
        </div>
      )}
    </div>
  );
}
