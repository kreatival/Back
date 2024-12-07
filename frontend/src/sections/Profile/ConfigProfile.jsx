import Button from "../../components/Button";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
const ConfigProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  //funcio para desplegar la tabla
  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="border rounded-md">
        <Button
          type="button"
          onClick={toggleTable}
          className="bg-gradient-profile !py-3 w-full text-lg sm:text-[24px] flex justify-center items-center"
        >
          <h1 className="font-medium text-xl text-[#192739]">Configuración</h1>
          {isOpen ? (
            <FaCaretUp className="ml-2 text-[#1C304A] text-opacity-50" />
          ) : (
            <FaCaretDown className="ml-2 text-[#1C304A] text-opacity-50" />
          )}
        </Button>
        {isOpen && (
          <div className="flex flex-col p-2 gap-1 sm:gap-3 sm:flex-row justify-center w-full">
            <div className="flex justify-center items-center sm:max-w-[218px] w-full">
              <Link
                to="/perfil/cambiar-contraseña"
                className="flex w-full justify-center text-nowrap border rounded-md border-mainBlue text-mainBlue text-center text-sm sm:text-lg sm:py-2.5 py-3 px-3.5 font-medium"
              >
                Cambiar contraseña
              </Link>
            </div>
            <div className="flex justify-center items-center sm:max-w-[218px] w-full">
              <Link
                to="/perfil/soporte"
                className="flex w-full justify-center border rounded-md border-mainBlue text-mainBlue text-sm sm:text-lg text-center sm:py-2.5 py-3 px-3.5 font-medium"
              >
                Soporte
              </Link>
            </div>
            <div className="flex justify-center items-center sm:max-w-[218px] w-full">
              <Link
                to="/"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
                className="flex w-full justify-center border rounded-md text-white bg-mainBlue text-sm sm:text-lg text-center sm:py-2.5 py-3 px-3.5 font-medium"
              >
                Cerrar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConfigProfile;
