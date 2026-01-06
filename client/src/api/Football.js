import { footballApiClient as apiClient } from "../utils/axios";

export const getLeagues = async () => {
  try {
    const response = await apiClient.get(
      "/leagues?country=world&season=2025"
    );

    return response.data.response;
  } catch (error) {
    console.log("error fetching football leagues", error);
  }
};

export const getFixtures = async () => {
  // console.log("This is apiClient"+ apiClient)
  try {
    const response = await apiClient.get("/fixtures?last=23");

    return response.data.response.filter(
      (e) => e.fixture.status.short !== "NS"
    );
  } catch (error) {
    console.log("error fetching fixtures", error);
  }
};

export const getPlayers = async () => {
  try {
    const response = await apiClient.get(
      "/players/topscorers?league=39&season=2024"
    );

    return response.data.response.slice(0, 11);
  } catch (error) {
    console.log("error fetching players", error);
  }
};

export const getFBPlayerInfo = async (id) => {
  try {
    const response = await apiClient.get("/players/?season=2024&id=" + id);

    return response.data.response;
  } catch (error) {
    console.log("error fetching info", error);
  }
};
