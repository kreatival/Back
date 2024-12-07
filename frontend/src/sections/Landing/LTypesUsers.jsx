import Odontologa from "../../assets/Landing/Odontologa.svg";
import Secretario from "../../assets/Landing/Secretario.svg";
import Administrador from "../../assets/Landing/Administrador.svg";
import { BsDot } from "react-icons/bs"; // O cualquier otro ícono

export default function LTypesUsers() {
  return (
    <div
      className="sm:py-[70px] py-8 sm:px-14 px-6 w-full"
      style={{
        backgroundImage: "linear-gradient(to bottom, #FAFDFF, #DBE5FF)",
      }}
    >
      <div className="w-full flex flex-col sm:gap-6 gap-3 items-center">
        <h2 className="text-[#143D72] text-center sm:font-medium font-semibold sm:text-[40px] text-2xl">
          Nuestros tipos de usuarios
        </h2>
        <div className="flex items-center lg:h-[538px]">
          <ul className="flex md:flex-row flex-col gap-6 h-full">
            <li className="border border-opacity-25 border-[#1C3454] bg-white p-6 rounded-lg max-w-[348px] w-full flex flex-col items-center gap-6">
              <img src={Odontologa} alt="Odontologa" />
              <h3 className="text-[#143D72] text-center sm:text-2xl text-base font-bold">
                Odontólogo
              </h3>
              <ul className="flex flex-col gap-2 max-w-[280px] w-full">
                <li className="flex items-start gap-2">
                  <BsDot className="text-xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Consultar agenda diaria y semanal.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BsDot className="text-2xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Acceder al historial de visitas de los pacientes.
                  </span>
                </li>
              </ul>
            </li>
            <li className="border border-opacity-25 border-[#1C3454] bg-white p-6 rounded-lg max-w-[348px] w-full flex flex-col items-center gap-6">
              <img src={Secretario} alt="Secretario" />
              <h3 className="text-[#143D72] text-center sm:text-2xl text-base font-bold">
                Secretario
              </h3>
              <ul className="flex flex-col gap-2 max-w-[280px] w-full">
                <li className="flex sm:items-start items-center gap-2">
                  <BsDot className="text-xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Agendar y modificar turnos.
                  </span>
                </li>
                <li className="flex sm:items-start items-center gap-2">
                  <BsDot className="sm:text-3xl text-xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Confirmar, reprogramar y cancelar turnos.
                  </span>
                </li>
                <li className="flex sm:items-start items-center gap-2">
                  <BsDot className="sm:text-2xl text-xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Activar recordatorios automáticos.
                  </span>
                </li>
              </ul>
            </li>
            <li className="border border-opacity-25 border-[#1C3454] bg-white p-6 rounded-lg max-w-[348px] w-full flex flex-col items-center gap-6">
              <img src={Administrador} alt="Administrador" />
              <h3 className="text-[#143D72] text-center sm:text-2xl text-base font-bold">
                Administrador
              </h3>
              <ul className="flex flex-col gap-2 max-w-[280px] w-full">
                <li className="flex sm:items-start items-center gap-2">
                  <BsDot className="text-2xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Acceso completo.
                  </span>
                </li>
                <li className="flex sm:items-start items-center gap-2">
                  <BsDot className="text-2xl text-[#143D72] mt-1" />
                  <span className="text-[#143D72] sm:text-xl text-sm">
                    Añadir y eliminar usuarios.
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
