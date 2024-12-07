import { BASE_URL } from "../constants/base-url";
import axios from "axios";

export const getDentists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users?role_id=3`);
    return response;
  } catch (error) {
    
    throw error;
  }
};
