import data from "../data.json";
import { sofaScoreApi } from "./axios";

async function findTournamentIdAndFetchOdds(
  team1,
  team2,
  startTime,
  method = 0
) {
  const matches = data.sofaScoreIplMatches;

  for (const match of matches) {
    const home = match.homeTeam?.shortName?.toLowerCase();
    const away = match.awayTeam?.shortName?.toLowerCase();
    const matchTime = match.startTimestamp;

    if (
      ((home === team1.toLowerCase() && away === team2.toLowerCase()) ||
        (home === team2.toLowerCase() && away === team1.toLowerCase())) &&
      matchTime === Math.floor(startTime / 1000)
    ) {
      const matchId = match?.id;

      if (method === 0) {
        try {
          const res = await sofaScoreApi.get("/matches/get-all-odds", {
            params: { matchId },
          });
          return res.data;
        } catch (err) {
          console.error("Error fetching odds:", err);
          return null;
        }
      } else if (method === 1) {
        try {
          const [odds, lineups, h2h] = await Promise.all([
            sofaScoreApi.get("/matches/get-all-odds", { params: { matchId } }),
            sofaScoreApi.get("/matches/get-lineups", { params: { matchId } }),
            sofaScoreApi.get("/matches/get-head2head", { params: { matchId } }),
          ]);

          return {
            odds: odds.data,
            lineups: lineups.data,
            h2h: h2h.data,
          };
        } catch (err) {
          console.error("Error fetching match data:", err);
          return null;
        }
      }
    }
  }

  console.log("No matching match found");
  return null;
}

export default findTournamentIdAndFetchOdds;
