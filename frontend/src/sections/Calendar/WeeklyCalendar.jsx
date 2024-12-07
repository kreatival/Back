import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EventsContent from "./EventsContent";
import { ScheduleShift, EditShift } from "../ShiftManager/Modal";
import { isBefore, isToday, isFuture } from "date-fns";
import { Button } from "antd";
import { IoMenu } from "react-icons/io5";
import { useDecode } from "../../hooks/useDecode";
import { apiGetClinicalInfoById } from "../../api/clinicalInfo/apiClinicalInfo";
import { apiGetUserById } from "../../api/users/apiUsers";
export default function WeeklyCalendar({
  eventsDB,
  setModalModifyIsVisible,
  modalModifyIsVisible,
  data,
  forceCalendarUpdate,
  setOpenDrawer,
  dentistID,
  currentDate,
  setCurrentDate,
}) {
  const [calendarApis, setCalendarApis] = useState(null);
  const [contentHeight, setContentHeight] = useState(600);
  const [eventClickInfo, setEventClickInfo] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [infoEventSelected, setInfoEventSelected] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth);
  const [infoClinic, setInfoClinic] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  //uso el decode para traer el id del usuario

  const token = localStorage.getItem("token");
  const decode = useDecode(token);
  const role = decode.role;

  //traigo el usuario para conseguir la info de la clinica
  useEffect(() => {
    const fetchInfoClinic = async () => {
      try {
        //para obtener el id de la clinica
        const resUser = await apiGetUserById(decode.user_id);
        const res = await apiGetClinicalInfoById(resUser.data.clinic_id);
        if (res && res.data) {
          setInfoClinic(res.data); // Actualiza el estado con la información de la clínica
        }
      } catch (err) {
        setError("Error de la API:", err);
      }
    };
    fetchInfoClinic();
  }, [decode.user_id]);

  const calendarRef = useRef(null);
  const currentDateRef = useRef(currentDate);

  useEffect(() => {
    currentDateRef.current = currentDate;
  }, [currentDate]);

  const adjustContentHeight = useCallback(() => {
    setIsSmallScreen(window.innerWidth);
    const height = window.innerHeight;
    setContentHeight(height < 680 ? 500 : height < 768 ? 600 : 640);
  }, []);

  useEffect(() => {
    adjustContentHeight();
    window.addEventListener("resize", adjustContentHeight);
    return () => window.removeEventListener("resize", adjustContentHeight);
  }, [adjustContentHeight]);

  useEffect(() => {
    if (calendarApis && currentDate) {
      calendarApis.changeView("timeGridDay", currentDate);
    }
  }, [calendarApis, currentDate]);

  const handleDatesSet = useCallback(
    (arg) => {
      setCalendarApis(arg.view.calendar);
      const newDate = arg.view.currentStart;
      if (newDate.getTime() !== currentDateRef.current.getTime()) {
        setCurrentDate(newDate);
      }
    },
    [setCurrentDate]
  );

  const handleDateSelect = useCallback((selectInfo) => {
    const now = new Date();
    const selectedStart = new Date(selectInfo.start);
    const dayOfWeek = selectedStart.getDay();

    if (
      (isToday(selectedStart) || isFuture(selectedStart)) &&
      dayOfWeek !== 0
    ) {
      if (isToday(selectedStart) && isBefore(selectedStart, now)) {
        return;
      }
      setInfoEventSelected(selectInfo);
      setShowModal(true);
    }
  }, []);

  const handleEventClick = useCallback(
    (clickInfo) => {
      if (role === "dentist") return;
      const now = new Date();
      const selectedStart = new Date(clickInfo.event.start);
      const dayOfWeek = selectedStart.getDay();

      if (
        (isToday(selectedStart) || isFuture(selectedStart)) &&
        dayOfWeek !== 0
      ) {
        if (isToday(selectedStart) && isBefore(selectedStart, now)) {
          return;
        }
        setEventClickInfo(clickInfo.event);
        setModalModifyIsVisible(true);
      }
    },
    [role, setModalModifyIsVisible]
  );

  const handleShowBurger = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, [setOpenDrawer]);

  const calendarOptions = useMemo(
    () => ({
      locale: esLocale,
      plugins: [timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: `${isSmallScreen > 954 ? "prev,next today" : ""}`,
        center: "title",
        right: `${
          isSmallScreen > 954 ? "timeGridWeek,timeGridDay" : "prev,next"
        }`,
      },
      initialView: "timeGridDay",
      selectable: role !== "dentist",
      selectOverlap: false,
      selectMirror: true,
      selectConstraint: {
        start: new Date(),
        end: "2100-01-01",
      },
      dayMaxEvents: true,
      weekends: true,
      hiddenDays: [0],
      events: eventsDB,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventOverlap: false,
      editable: false,
      eventDurationEditable: false,
      datesSet: handleDatesSet,
      slotDuration: "00:30:00",
      slotMinTime: infoClinic ? infoClinic.opening_hours + ":00" : "08:00:00",
      slotMaxTime: infoClinic ? infoClinic.closing_hours + ":00" : "21:00:00",
      allDaySlot: false,
      contentHeight: contentHeight,
      slotLabelFormat: {
        hour: "numeric",
        minute: "2-digit",
        meridiem: false,
      },
    }),
    [
      isSmallScreen,
      role,
      eventsDB,
      handleDateSelect,
      handleEventClick,
      handleDatesSet,
      infoClinic,
      contentHeight,
    ]
  );

  return (
    <>
      <div className="relative p-2 pb-3 demo-app">
        <div className="demo-app-main">
          <FullCalendar
            ref={calendarRef}
            {...calendarOptions}
            eventContent={(eventInfo) => (
              <EventsContent
                eventInfo={eventInfo}
                forceCalendarUpdate={forceCalendarUpdate}
                data={data}
              />
            )}
          />
        </div>
        <div
          className={`absolute top-0 left-0 z-40 w-full h-full backdrop-blur-sm ${
            eventsDB && "hidden"
          }`}
        ></div>
      </div>
      <div className="absolute left-2 top-2 lg:hidden">
        <Button className="border-none" onClick={handleShowBurger}>
          <IoMenu className="text-xl font-semibold" />
        </Button>
      </div>
      {modalModifyIsVisible && (
        <EditShift
          data={data}
          eventInfo={eventClickInfo}
          isVisible={modalModifyIsVisible}
          setModalModifyIsVisible={setModalModifyIsVisible}
          forceCalendarUpdate={forceCalendarUpdate}
        />
      )}
      {showModal && (
        <ScheduleShift
          isVisible={showModal}
          setModalShiftIsVisible={setShowModal}
          data={data}
          forceCalendarUpdate={forceCalendarUpdate}
          dateSelected={infoEventSelected}
          dentistID={dentistID}
        />
      )}
    </>
  );
}

WeeklyCalendar.propTypes = {
  data: PropTypes.object.isRequired,
  modalModifyIsVisible: PropTypes.bool.isRequired,
  setModalModifyIsVisible: PropTypes.func.isRequired,
  forceCalendarUpdate: PropTypes.func.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
  openDrawer: PropTypes.bool.isRequired,
  eventsDB: PropTypes.array,
  dentistID: PropTypes.string,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
};
