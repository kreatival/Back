import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Spin } from "antd";
import WeeklyCalendar from "../../sections/Calendar/WeeklyCalendar";
import { getAppointments, getDentists, getAllReasons } from "../../api";
import { useDecode } from "../../hooks/useDecode";
import toast, { Toaster } from "react-hot-toast";
import {
  ScheduleShift,
  SelectDentistModal,
} from "../../sections/ShiftManager/Modal";
import { FaChevronDown } from "react-icons/fa";
import StatusIndicators from "../../sections/ShiftManager/StatusIndicators";
import CustomCalendar from "../../sections/Calendar/CustomCalendar";

const CalendarPage = React.memo(function CalendarPage() {
  const [eventsDB, setEventsDB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalModifyIsVisible, setModalModifyIsVisible] = useState(false);
  const [isDentist, setIsDentist] = useState(null);
  const [dentistID, setDentistID] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [data, setData] = useState({ dentists: null, reasons: null });

  const decoded = useDecode(localStorage.getItem("token"));

  useEffect(() => {
    if (decoded && decoded.role === "dentist") {
      setDentistID(decoded.user_id);
      setIsDentist(true);
    }
  }, [decoded]);

  const fetchAppointments = useCallback(async (dentistID) => {
    setLoading(true);
    try {
      const response = await getAppointments({ id: dentistID });
      setEventsDB(response);
    } catch (error) {
      toast.error("Error al obtener las citas. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dentistID) {
      fetchAppointments(dentistID);
    } else {
      setEventsDB(null);
    }
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [dentistID, calendarKey, fetchAppointments]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [dentistsResponse, reasonsResponse] = await Promise.all([
        getDentists(),
        getAllReasons(),
      ]);
      setData({
        dentists: dentistsResponse.data,
        reasons: reasonsResponse.data,
      });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Problemas en el servidor. Por favor, intenta nuevamente");
      } else {
        toast.error(
          "No se pudo conectar con el servidor. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const forceCalendarUpdate = useCallback(() => {
    setCalendarKey((prevKey) => prevKey + 1);
  }, []);

  const handleSelectDentistID = useCallback((value) => {
    setDentistID(value);
  }, []);

  const handleOpenModalAdd = useCallback(() => {
    setShowModalCreate(true);
  }, []);

  const handleCalendarChange = useCallback((date) => {
    setCurrentDate(date);
  }, []);

  const renderDentistSelect = useMemo(() => {
    if (!eventsDB || isDentist) return null;
    return (
      <div className="relative w-full mt-3 lg:text-lg max-w-72">
        <select
          defaultValue={dentistID}
          className="appearance-none cursor-pointer bg-white py-1.5 px-2.5 w-full rounded border border-mainBlue text-textBlue focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          onChange={(e) => handleSelectDentistID(e.target.value)}
        >
          <option value="" disabled hidden>
            Seleccionar profesional
          </option>
          {data.dentists &&
            data.dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.first_name} {dentist.last_name}
              </option>
            ))}
        </select>
        <FaChevronDown className="text-textBlue absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
      </div>
    );
  }, [eventsDB, isDentist, dentistID, data.dentists, handleSelectDentistID]);

  return (
    <>
      <div className="max-w-7xl relative flex justify-center w-full mx-auto bg-white border-2 border-[#1C3454]/26 border-solid rounded my-6 font-sans">
        <div
          className={`${
            eventsDB && "hidden"
          } absolute z-40 w-full h-full bg-white opacity-60`}
        ></div>
        {loading && (
          <div className="absolute top-0 z-50 flex items-center justify-center w-full h-full mx-auto">
            <Spin spinning={loading} tip="Cargando" size="large">
              <div
                className="rounded p-14"
                style={{ background: "rgba(0, 0, 0, 0.05)" }}
              />
            </Spin>
          </div>
        )}

        <>
          <WeeklyCalendar
            forceCalendarUpdate={forceCalendarUpdate}
            data={data}
            eventsDB={eventsDB}
            dentistID={dentistID}
            modalModifyIsVisible={modalModifyIsVisible}
            setModalModifyIsVisible={setModalModifyIsVisible}
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <div
            className={`px-3 border-l-2 border-[#1A3860]/10 w-72 lg:w-80 min-w-[300px] ${
              openDrawer
                ? "block absolute z-50 lg:relative lg:hidden bg-white right-0 top-0"
                : "hidden lg:block"
            }`}
          >
            <CustomCalendar
              onChange={handleCalendarChange}
              value={currentDate}
            />
            <div
              className={`flex flex-col items-center justify-center py-5 w-full mx-auto ${
                isDentist && "hidden"
              }`}
            >
              <div className="w-full">
                <Button
                  onClick={handleOpenModalAdd}
                  type="primary"
                  className="w-full h-10 px-4 py-3 font-sans text-base font-semibold rounded"
                >
                  Agendar Turno
                </Button>
              </div>
              {renderDentistSelect}
            </div>
            <StatusIndicators />
            {showModalCreate && (
              <ScheduleShift
                isVisible={showModalCreate}
                setModalShiftIsVisible={setShowModalCreate}
                data={data}
                forceCalendarUpdate={forceCalendarUpdate}
              />
            )}
          </div>
        </>
      </div>
      <div
        className={`${
          eventsDB && "hidden"
        } absolute z-40 top-16 justify-center mx-auto w-full flex items-center h-full transition-opacity duration-1000 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <SelectDentistModal
          handleChange={handleSelectDentistID}
          dentists={data.dentists}
        />
      </div>
      <Toaster position="top-right" />
    </>
  );
});

export default CalendarPage;
