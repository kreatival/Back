import CardWhite from "../../components/CardWhite";
import DropTable from "../../components/DropTable";
import ConfigProfile from "./ConfigProfile";
import { FaRegEdit } from "react-icons/fa";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiGetClinicalInfoById } from "../../api/clinicalInfo/apiClinicalInfo";
import { useDecode } from "../../hooks/useDecode";
import { apiGetUserById } from "../../api/users/apiUsers";
import { Toaster, toast } from "react-hot-toast";

const Adjustments = () => {
  const token = localStorage.getItem("token");
  const decode = useDecode(token);
  const role = decode.role;

  const [infoClinic, setInfoClinic] = useState(null);

  // Mapeo de nombres de columnas a nombres legibles en español y el useMemo para evitar que se recalcule en cada render
  const columnNames = useMemo(
    () => ({
      name: "Nombre",
      phone_number: "Teléfono",
      address: "Dirección",
      email: "Correo",
      opening_hours: "Apertura",
      closing_hours: "Cierre",
    }),
    []
  );

  // usamos useCallback para evitar que se recalcule en cada render
  const transformData = useCallback(
    (clinic) => {
      return Object.keys(clinic)
        .filter((key) => key !== "id")
        .map((key) => ({
          nombre: columnNames[key] || key, // Usa el nombre legible si existe, sino usa la clave original
          value: clinic[key],
        }));
    },
    [columnNames]
  );

  useEffect(() => {
    const fetchInfoClinic = async () => {
      try {
        //para obtener el id de la clinica
        const resUser = await apiGetUserById(decode.user_id);
        const res = await apiGetClinicalInfoById(resUser.data.clinic_id);
        if (res && res.data) {
          setInfoClinic(transformData(res.data)); // Actualiza el estado con la información de la clínica
        }
      } catch (error) {
        toast.error("Error del servidor");
      }
    };
    fetchInfoClinic();
  }, [decode.user_id, transformData]);

  const section2 = [
    {
      nombre: "Motivo",
      value: "Peronaliza los motivos",
      icon: (
        <div className="flex items-center justify-center gap-2 relative w-full">
          <FaRegEdit className="absolute sm:right-2 right-1 sm:text-2xl text-base text-[#1C304A] text-opacity-50" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white max-w-[746px] w-full gap-6 px-[16px]">
        <CardWhite className="!gap-4 py-6 sm:px-6 px-3 sm:py-[34px]">
          <h1 className="text-2xl sm:text-[28px] font-medium text-[#192739]">
            Ajustes generales
          </h1>
          <div className="border rounded-md border-[#1C3454] border-opacity-25">
            <DropTable
              nameButton={"Información de la clínica"}
              sections={infoClinic}
            />
          </div>
          {(role === "admin" || role === "secretary") && (
            <div className="border rounded-md border-[#1C3454] border-opacity-25">
              <DropTable
                nameButton={"Consultas"}
                sections={section2}
                redirect={"/perfil/motivos"}
              />
            </div>
          )}
          <div className="border rounded-md border-[#1C3454] border-opacity-25">
            <ConfigProfile nameButton={"Consultas"} sections={section2} />
          </div>
        </CardWhite>
      </div>
    </>
  );
};

export default Adjustments;
