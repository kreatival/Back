import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.css";

function CustomCalendar({ onChange, value }) {
  const tileDisabled = ({ date }) => {
    // Deshabilita los domingos
    return date.getDay() === 0;
  };

  const formatShortWeekday = (locale, date) => {
    const weekdays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return weekdays[date.getDay()];
  };

  return (
    <Calendar
      onChange={onChange}
      value={value}
      tileDisabled={tileDisabled}
      minDetail={"month"}
      maxDetail={"month"}
      formatShortWeekday={formatShortWeekday}
      next2Label={null}
      prev2Label={null}
      showFixedNumberOfWeeks={true}
    />
  );
}

export default CustomCalendar;

CustomCalendar.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
