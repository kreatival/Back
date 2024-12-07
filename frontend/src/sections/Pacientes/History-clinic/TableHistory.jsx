import PropTypes from "prop-types";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getAppointmentConfirmedPatientById } from "../../../api/appointments/appointments-services";

// patienId es el id del paciente traido desde HistoryClinic.jsx
export default function TableHistory({
  patientId,
  appointmentsCache,
  setAppointmentsCache,
}) {
  // estado para guardar los turnos
  const [turnos, setTurnos] = useState([]);
  //estado de loading
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("date", {
      header: () => "FECHA",
      cell: (info) => info.getValue(), // Obtiene el valor de la celda
    }),
    columnHelper.accessor("time", {
      header: () => "HORA",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("reason", {
      header: () => "MOTIVO",
      cell: (info) => info.getValue(),
    }),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (appointmentsCache[patientId]) {
          // Si los datos están en caché, utilízalos
          setTurnos(appointmentsCache[patientId]);
          setLoading(false);
        } else {
          setLoading(true); // Empieza a cargar los datos

          // Obtiene los turnos confirmados del paciente
          const response = await getAppointmentConfirmedPatientById(patientId);

          //Ordenar las citas por fecha y hora de menor a mayor, está comentado porque ya desde el backend viene ordenado
          /*const sortedAppointments = response.data.sort((a, b) => {
          // Convierte la fecha y hora en un objeto Date para poder comparar las fechas
          const dateA = new Date(
            a.date.split("-").reverse().join("-") + "T" + a.time
          );
          const dateB = new Date(
            b.date.split("-").reverse().join("-") + "T" + b.time
          );
          return dateB - dateA;
        });*/

          // Almacena en caché los resultados
          setAppointmentsCache((prevCache) => ({
            ...prevCache,
            [patientId]: response.data,
          }));

          setTurnos(response.data);
        }
      } catch (error) {
        console.error("Error de la API:", error);
      } finally {
        setLoading(false); // Termina la carga de datos
      }
    };
    fetchData();
  }, [patientId, appointmentsCache, setAppointmentsCache]);

  const table = useReactTable({
    data: turnos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative">
      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      {/* Mensaje si no hay turnos */}
      {!loading && turnos.length === 0 && (
        <div className="flex items-center justify-center py-4 text-lg font-semibold text-gray-600">
          Este paciente no tiene turnos confirmados.
        </div>
      )}
      {/* Tabla en caso de que haya turnos */}
      {!loading && turnos.length > 0 && (
        <table className="w-full table-auto">
          <thead className="w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex gap-2.5 px-4 py-3">
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    className={`min-h-11 flex items-center justify-center px-3.5 border border-[#BBD9FF] rounded text-[#005FDB] text-lg font-semibold ${
                      column.id === "reason" ? "flex-1" : "flex-none w-1/5"
                    }
                    ${column.id === "hour" && "w-[77px]"}`}
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #FAFDFF, #DBE5FF)",
                    }}
                  >
                    <div>
                      {flexRender(
                        column.column.columnDef.header,
                        column.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="flex flex-col gap-2.5">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="flex gap-2.5 px-4">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.column.id}
                    className={`min-h-11 flex items-center justify-center px-2.5 py-3 border border-[#99C3FB] text-[#192739] bg-white text-center rounded sm:text-lg text-base font-normal ${
                      cell.column.id === "reason" ? "flex-1" : "flex-none w-1/5"
                    }
                    ${cell.column.id === "hour" && "max-w-[77px] w-full"}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

TableHistory.propTypes = {
  patientId: PropTypes.string.isRequired,
  appointmentsCache: PropTypes.object.isRequired,
  setAppointmentsCache: PropTypes.func.isRequired,
};
