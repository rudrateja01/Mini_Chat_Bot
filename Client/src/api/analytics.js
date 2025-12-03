import axios from "axios";

export const getAnalytics = async () => {
  const res = await axios.get("http://localhost:4000/api/analytics");
  return res.data.analytics;
};
