import { BASE_URL } from "../constants/base-url";
import { APPOINTMENTS_PATHS } from "../constants/paths/appointments-paths";
import axios from "axios";
import formatEvents from "./appointmets-format";

export const getAppointments = async ({ id }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${APPOINTMENTS_PATHS.GET_BY_DENTIST_ID}/${id}`
    );

    return formatEvents(response.data);
  } catch (error) {
    return error;
  }
};

export const updateAppointment = async ({ id, data }) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${APPOINTMENTS_PATHS.UPDATE_APPOINTMENT}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createAppointment = async ({ data }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${APPOINTMENTS_PATHS.CREATE_APPOINTMENT}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET APPOINTMENT PATIENT BY ID
export const getAppointmentPatientById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/patient/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${APPOINTMENTS_PATHS.DELETE_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateAppointmentState = async ({ id, data }) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${APPOINTMENTS_PATHS.UPDATE_APPOINTMENT_STATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET APPOINTMENT CONFIRMED BY ID PATIENT
export const getAppointmentConfirmedPatientById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/appointments/patient/${id}/confirmed`
    );
    return response;
  } catch (error) {
    return error;
  }
};

