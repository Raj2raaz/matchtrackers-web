import axios from "axios";

// Helper: Normalize team names for fuzzy matching
function normalizeTeamName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper: Fuzzy team name comparison
function isTeamMatch(teamA, teamB) {
  const normA = normalizeTeamName(teamA);
  const normB = normalizeTeamName(teamB);
  if (normA === normB) return true;
  // Simple abbreviation logic, can be expanded
  return normA.startsWith(normB) || normB.startsWith(normA);
}

const sofascoreApiKey = import.meta.env.VITE_CRICBUZZ_API_KEY;

// MAIN FUNCTION
async function getMatchOddsFromCricbuzzToSofascore({
  team1,
  team2,
  startTime, // ISO string or timestamp
}) {
  try {
    const dateObj = new Date(Number(startTime));

    // 1. Get Sofascore cricket category ID
    // const categoryResp = await axios.get(
    //   "https://sofascore.p.rapidapi.com/categories/list?sport=cricket",
    //   { headers: { "X-RapidAPI-Key": sofascoreApiKey } }
    // );
    const cricketCategoryId = 1350;

    if (!cricketCategoryId)
      throw new Error("Cricket category not found on Sofascore");

    // 2. Format date as YYYY-MM-DD for Sofascore
    const dateString = dateObj.toISOString().slice(0, 10);

    // 3. Get all Sofascore events on that date
    const eventsResp = await axios.get(
      `https://sofascore.p.rapidapi.com/tournaments/get-scheduled-events?categoryId=${cricketCategoryId}&date=${dateString}`,
      { headers: { "X-RapidAPI-Key": sofascoreApiKey } }
    );
    const events = eventsResp.data.events || [];

    // 4. Find the matching event by fuzzy team name and closest start time
    let bestMatch = null;
    let minTimeDiff = Infinity;
    for (const event of events) {
      const home = event.homeTeam?.name || "";
      const away = event.awayTeam?.name || "";
      const eventTime = new Date(event.startTimestamp * 1000); // Sofascore uses UNIX seconds

      if (
        (isTeamMatch(home, team1) && isTeamMatch(away, team2)) ||
        (isTeamMatch(home, team2) && isTeamMatch(away, team1))
      ) {
        const diff = Math.abs(eventTime - dateObj);

        if (diff < minTimeDiff) {
          minTimeDiff = diff;
          bestMatch = event;
        }
      }
    }
    if (!bestMatch) {
      // console.log("No matching event found after checking all events.");
      throw new Error(
        "No matching event found on Sofascore for given teams and date"
      );
    }

    // console.log("Best matched event:", {
    //   id: bestMatch.id,
    //   home: bestMatch.homeTeam?.name,
    //   away: bestMatch.awayTeam?.name,
    //   eventTime: new Date(bestMatch.startTimestamp * 1000).toISOString(),
    // });

    // 5. Get odds for the matched Sofascore event
    const oddsResp = await axios.get(
      `https://sofascore.p.rapidapi.com/matches/get-all-odds?matchId=${bestMatch.id}`,
      { headers: { "X-RapidAPI-Key": sofascoreApiKey } }
    );
    const odds = oddsResp.data || [];

    // 6. Return structured odds data
    return odds;
  } catch (error) {
    console.log("=== ERROR ===");
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default getMatchOddsFromCricbuzzToSofascore;
