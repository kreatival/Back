import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import EditClinical from "./Modal/EditClinical";
import {
  apiGetClinicalInfoById, // GET BY ID
  apiEditClinicalInfo, // PATCH
} from "../../api/clinicalInfo/apiClinicalInfo";
import { apiGetUserById } from "../../api/users/apiUsers";
import { useDecode } from "../../hooks/useDecode";
import { clinicalStore } from "../../context/clinicalStore";
import { toast, Toaster } from "react-hot-toast";

export default function TableClinicalInfo() {
  // Variable para guardar el token decodificado
  const decoded = useDecode(localStorage.getItem("token"));
  const {
    clinics,
    isLoading,
    modalEditVisible,
    valueData,
    setClinics,
    setIsLoading,
    openModal,
    closeModal,
    updateClinic,
  } = clinicalStore();

  // columnHelper es un objeto con funciones para crear columnas de la tabla
  const columnHelper = createColumnHelper();

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
          data: columnNames[key] || key, // Usa el nombre legible si existe, sino usa la clave original
          description: clinic[key],
        }));
    },
    [columnNames]
  );

  useEffect(() => {
    // Función para obtener la información de la clínica
    const fetchData = async () => {
      try {
        const clinicUserId = await apiGetUserById(decoded.user_id);
        const res = await apiGetClinicalInfoById(clinicUserId.data.clinic_id);
        // para validar que la respuesta sea correcta
        if (res && res.data) {
          // Transformar la información de la clínica para mostrarla en la tabla
          const transformedData = transformData(res.data);
          setClinics(transformedData);
        }
      } catch (error) {
        console.error("Error de la API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setClinics, setIsLoading, decoded.user_id, transformData]);

  const columns = [
    columnHelper.accessor("data", {
      header: () => "DATO",
      cell: (info) => columnNames[info.getValue()] || info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: () => "DESCRIPCIÓN",
      cell: (
        info // Aquí se puede cambiar el estilo del texto
      ) => (
        <div className="flex items-center justify-center gap-2 relative w-full">
          <span>{info.getValue()}</span>
          <FiEdit className="text-blue-500 cursor-pointer absolute right-0" />
        </div>
      ),
    }),
  ];

  const handleEditRow = (row) => {
    // Abre el modal para editar la información de la clínica
    openModal({
      id: row.original.id,
      data: row.original.data,
      description: row.original.description,
    });
  };

  const handleSubmitEdit = async (formData) => {
    const valueInputSpanish =
      (formData.data === "Nombre" && "name") ||
      (formData.data === "Dirección" && "address") ||
      (formData.data === "Teléfono" && "phone_number") ||
      (formData.data === "Correo Electrónico" && "email") ||
      (formData.data === "Horario de apertura" && "opening_hours") ||
      (formData.data === "Horario de cierre" && "closing_hours");

    // Validar si es un número cuando se edita el número de teléfono
    if (
      valueInputSpanish === "phone_number" &&
      !/^\d+$/.test(formData.description)
    ) {
      toast.error("El número de teléfono debe contener solo dígitos.");
      return;
    }

    // Validar si es un correo electrónico cuando se edita el correo
    if (
      valueInputSpanish === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.description)
    ) {
      toast.error("El correo electrónico no tiene un formato válido.");
      return;
    }
    // Validar si el nombre es solo letras
    if (
      valueInputSpanish === "name" &&
      !/^[a-zA-Z\s]*$/.test(formData.description)
    ) {
      toast.error("El nombre solo puede contener letras.");
      return;
    }

    try {
      // Obtener el id de la clínica
      const userId = await apiGetUserById(decoded.user_id);
      // aca guaradmos en clinicId el id de la clinica del usuario
      const clinicId = userId.data.clinic_id;

      // Enviar la información actualizada a la API
      const response = await apiEditClinicalInfo(clinicId, {
        [valueInputSpanish]: formData.description,
      });

      // Validar que la respuesta sea correcta
      if (response.status === 200) {
        // Actualizar la información de la clínica en el estado global
        updateClinic({
          id: clinicId,
          data: formData.data, // Este es el nombre en español (visible en la tabla)
          description: formData.description,
        });
        toast.success(
          "La información de la clínica ha sido actualizada con éxito"
        );
      }
    } catch (error) {
      console.error("Error al editar la información:", error);
      toast.error("Error al actualizar la información");
    } finally {
      closeModal();
    }
  };

  const table = useReactTable({
    data: clinics,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="w-full table-auto">
        <thead className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex gap-2.5">
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  className={`min-h-[46px] flex items-center justify-center px-3.5 border border-[#BBD9FF] rounded text-[#005FDB] text-lg font-semibold ${
                    column.id === "data"
                      ? "w-2/5 sm:w-[186px]"
                      : "w-3/5 sm:flex-1"
                  }`}
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FAFDFF, #DBE5FF)",
                  }}
                >
                  {flexRender(
                    column.column.columnDef.header,
                    column.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="flex gap-2.5 mt-2.5">
              <td colSpan={columns.length} className="text-center">
                Cargando...
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="flex gap-2.5 mt-2.5"
                onClick={() => handleEditRow(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.column.id}
                    className={`flex items-center justify-center px-2.5 py-3 border border-[#99C3FB] text-[#192739] bg-white text-center rounded sm:text-lg text-base font-normal break-words whitespace-normal ${
                      cell.column.id === "data"
                        ? "w-2/5 sm:w-[186px]"
                        : "w-3/5 sm:flex-1"
                    }`}
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Toaster position="top-right" />
      {
        <EditClinical
          isVisible={modalEditVisible}
          setIsVisible={closeModal}
          valueData={valueData}
          onSubmit={handleSubmitEdit}
        />
      }
    </>
  );
}
