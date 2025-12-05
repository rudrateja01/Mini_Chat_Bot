import axios from "axios";

export const getAnalytics = async () => {
  const res = await axios.get("https://mini-chat-bot-ax9y.onrender.com/api/analytics");
  return res.data.analytics;
};
