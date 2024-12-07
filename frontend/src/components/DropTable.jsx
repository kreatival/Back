import Button from "./Button";
import { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Table = ({ nameButton, sections, redirect }) => {
  //seteo y funcion para desplegar la tabla
  const [isOpen, setIsOpen] = useState(false);
  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="border rounded-md">
        <Button
          type="button"
          onClick={toggleTable}
          className="bg-gradient-profile !py-3 w-full text-lg sm:text-2xl flex justify-center items-center"
        >
          <h1 className="font-medium text-xl text-[#192739]">{nameButton}</h1>
          {isOpen ? (
            <FaCaretUp className="ml-2 text-[#1C304A] text-opacity-50" />
          ) : (
            <FaCaretDown className="ml-2 text-[#1C304A] text-opacity-50" />
          )}
        </Button>
        {isOpen &&
          (!sections ? (
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl text-center font-bold">Cargando...</h2>
              </div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <tbody className="w-full bg-[#f6fbff]">
                {sections.map((section, index) => (
                  <tr
                    key={index}
                    className="flex gap-2 my-1 sm:my-2.5 ml-2 sm:ml-3"
                  >
                    <td className="text-center flex w-1/4">
                      <p className="w-full h-full border border-[#BBD9FF] rounded-md bg-white p-2 text-sm sm:text-lg flex items-center justify-center">
                        {section.nombre}
                      </p>
                    </td>
                    <td className="w-3/4">
                      <div className="flex items-center justify-center relative ">
                        <p className="w-full p-2 text-sm border border-[#193B67] border-opacity-5 sm:text-lg rounded-md text-center bg-[#193B67] bg-opacity-5 font-normal mr-2 pr-2 text-[#1C304A] text-opacity-50">
                          {section.value}
                        </p>

                        {section.icon && (
                          <Link
                            to={redirect}
                            className="absolute text-sm sm:text-lg right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-1"
                          >
                            {section.icon}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
      </div>
    </>
  );
};

export default Table;
