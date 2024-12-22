import axios from "axios";

export const sendCurrentRate = () =>
  axios.post(`${process.env.SERVICE_APP_URL}/api/rate`);
