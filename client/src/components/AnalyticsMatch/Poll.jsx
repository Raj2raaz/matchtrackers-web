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
    return <div className="flex justify-center py-6">Loading poll...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  // Calculate percentages for the progress bars
  const totalVotes = (poll?.team1Votes || 0) + (poll?.team2Votes || 0);
  const team1Percentage =
    totalVotes > 0 ? Math.round((poll?.team1Votes / totalVotes) * 100) : 50;
  const team2Percentage =
    totalVotes > 0 ? Math.round((poll?.team2Votes / totalVotes) * 100) : 50;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full mx-auto">
      <h2 className="text-xl font-bold text-center mb-6">
        Who do you think will WIN?
      </h2>

      <div className="flex justify-between mb-4">
        <div
          className={`flex-1 text-center px-3 py-1 rounded-l-lg transition-all ${
            userVote === 1
              ? "bg-green-500 text-white font-bold"
              : "bg-green-100 hover:bg-green-200"
          }`}
          onClick={() => !isSubmitting && handleVote(1)}
          role="button"
        >
          <p className="font-medium">{team1}</p>
          <p className="text-sm mt-0.5">{poll?.team1Votes || 0} votes</p>
        </div>

        <div
          className={`flex-1 text-center px-3 py-1 rounded-r-lg transition-all ${
            userVote === 2
              ? "bg-red-500 text-white font-bold"
              : "bg-red-100 hover:bg-red-200"
          }`}
          onClick={() => !isSubmitting && handleVote(2)}
          role="button"
        >
          <p className="font-medium">{team2}</p>
          <p className="text-sm mt-0.5">{poll?.team2Votes || 0} votes</p>
        </div>
      </div>

      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${team1Percentage}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500 ease-in-out"
            style={{ width: `${team2Percentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{team1Percentage}%</span>
        <span>{totalVotes} total votes</span>
        <span>{team2Percentage}%</span>
      </div>

      {!token && (
        <p className="text-center mt-4 text-sm text-gray-500">
          Log in to cast your vote!
        </p>
      )}

      {userVote && (
        <p className="text-center mt-4 text-sm">
          You voted for {userVote === 1 ? team1 : team2}.
          <span
            className="text-blue-500 ml-1 cursor-pointer underline"
            onClick={() => handleVote(userVote === 1 ? 2 : 1)}
          >
            Change vote?
          </span>
        </p>
      )}
    </div>
  );
}
