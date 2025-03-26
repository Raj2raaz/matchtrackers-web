import { footballApiClient as apiClient } from "../utils/axios";

export const getLeagues = async () => {
  try {
    const response = await apiClient.get(
      "/v3/leagues?country=world&season=2025"
    );

    return response.data.response;
  } catch (error) {
    console.log("error fetching football leagues", error);
  }
};

export const getFixtures = async () => {
  try {
    const response = await apiClient.get("/v3/fixtures?last=5");
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.log("error fetching fixtures", error);
  }
};
