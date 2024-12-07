import Us from "../../assets/Landing/us.png";

export default function LUs() {
  return (
    <div className="flex sm:flex-row flex-col gap-10 sm:py-[70px] py-10 justify-center items-center px-6 h-full border-b-2">
      <div className="sm:max-w-[533px] max-w-[318px] w-full max-h-[378px] h-full">
        <img src={Us} alt="Background" className="w-full h-full" />
      </div>
      <div className="flex flex-col max-w-[558px] w-full gap-8">
        <div className="flex flex-col sm:gap-8 gap-2">
          <h2 className="text-[#143D72] font-medium text-[40px] sm:flex hidden">
            Nosotros
          </h2>
          <h2 className="text-[#143D72] sm:hidden font-semibold text-2xl">
            ¿Quiénes somos?
          </h2>
          <h3 className="sm:text-2xl text-sm font-normal text-[#192739] text-opacity-95 w-full sm:max-w-[470px] max-w-[312px]">
            Nos especializamos en ofrecer soluciones tecnológicas para clínicas
            odontológicas. Nuestro objetivo es simplificar y optimizar la
            gestión de su clínica, para que pueda concentrarse en lo que
            realmente importa: el cuidado de sus pacientes.
          </h3>
        </div>
      </div>
    </div>
  );
}
