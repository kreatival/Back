import axios from "axios";
import { BASE_URL } from "./constants/base-url";
//POST reset password
export const apiResetPassword = async (email) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
      email: email,
    });
    return res;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
