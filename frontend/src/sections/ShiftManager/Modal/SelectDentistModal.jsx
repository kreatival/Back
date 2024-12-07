import PropTypes from "prop-types";
import CalendarCheckSvg from "./CalendarCheckSvg";
import CardWhite from "/src/components/CardWhite";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { Button } from "antd";
import { Link } from "react-router-dom";

function SelectDentistModal({ handleChange, dentists }) {
  return (
    <CardWhite className="mx-auto bg-white w-80 lg:w-[437px] lg:h-80 relative">
      <div className="absolute right-5 top-4">
        <Link to="/inicio">
          <Button className="border-none shadow-none">
            <FaTimes className="text-gray-600" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center h-full gap-2 p-5 text-center lg:px-14">
        <CalendarCheckSvg />
        <h2 className="text-2xl font-semibold text-mainBlue text-nowrap">
          Seleccioná un profesional
        </h2>
        <h3 className="text-lg">Para poder comenzar</h3>
        <div className="relative w-full mt-3 lg:text-lg max-w-72">
          <select
            defaultValue=""
            className="appearance-none cursor-pointer bg-white py-1.5 px-2.5 w-full rounded border border-mainBlue text-textBlue focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="" disabled hidden>
              Seleccionar profesional
            </option>
            {dentists &&
              dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.first_name} {dentist.last_name}
                </option>
              ))}
          </select>
          <FaChevronDown className="text-textBlue absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
        </div>
      </div>
    </CardWhite>
  );
}

SelectDentistModal.propTypes = {
  dentists: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
};

export default SelectDentistModal;
