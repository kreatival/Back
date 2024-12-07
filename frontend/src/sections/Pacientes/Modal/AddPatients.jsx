import PropTypes from "prop-types";
import CardWhite from "../../../components/CardWhite";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import addPatientSchema from "../../../validations/addPatient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { postPatient } from "../../../api/patients/apiPatients";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format, parse } from "date-fns";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

const locale = es;
registerLocale("es", locale);
export default function AddPatients({
  isVisible,
  setModalIsVisible,
  setPacientes,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      dni: "",
      email: "",
      phone_number: "",
      alternative_phone_number: " ",
    },
    resolver: zodResolver(addPatientSchema),
  });

  //estado para manejar la fecha
  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [err, setErr] = useState(null);

  const onSubmit = async (data) => {
    // Formatea la fecha seleccionada al formato ISO 8601
    const dateFormatted = selectedDate
      ? format(selectedDate, "yyyy-MM-dd") // Formato ISO 8601
      : "";

    const formattedData = {
      ...data,
      birth_date: dateFormatted,
      alternative_phone_number: data.alternative_phone_number || "NO", // Si no hay teléfono alternativo, enviar null
    };

    // Llamar a la API para añadir un paciente
    try {
      const res = await postPatient(formattedData);
      if (res.status === 201) {
        toast.success("Se añadió un paciente con éxito");
        // Actualizar la lista de pacientes
        setPacientes((prevPacientes) => [
          ...prevPacientes,
          {
            id: res.data.id,
            dni: formattedData.dni,
            patient: `${formattedData.first_name} ${formattedData.last_name}`,
          },
        ]);
        reset();
        setModalIsVisible(false);
      } else {
        toast.error("Error al añadir un paciente");
        setErr("Error al añadir un paciente:", res);
      }
    } catch (error) {
      setErr("Error al añadir un paciente:", error);
    }
  };

  // Manejo del cambio de la fecha
  const handleDatePickerChange = (date) => {
    const formattedDate = date ? format(date, "dd/MM/yyyy") : "";
    setValue("birth_date", formattedDate);
    setSelectedDate(date);
  };

  const parsedDate = selectedDate
    ? parse(format(selectedDate, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
    : null;

  const handleOnCancel = () => {
    setModalIsVisible(false);
  };

  return (
    isVisible && (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-50">
          <CardWhite className="bg-white max-w-[568px] w-full sm:p-6 p-3 pt-6 relative sm:max-h-max max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="pb-6">
              <h2 className="sm:text-[32px] text-2xl font-semibold text-[#192739]">
                Añadir paciente
              </h2>
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-sm font-normal text-red-600">
                {"Estos campos son requeridos"}
              </p>
            )}
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-row flex-wrap gap-3 sm:gap-6">
                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Nombre
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none
               ${errors.first_name && "border-red-600 border-2"}
               `}
                    type="text"
                    placeholder="Ingrese su nombre"
                    {...register("first_name", { required: true })}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Apellido
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none
                ${errors.last_name && "border-red-600 border-2"}`}
                    type="text"
                    placeholder="Ingrese su apellido"
                    {...register("last_name", { required: true })}
                  />
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-3 sm:gap-6">
                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Fecha de nacimiento
                  </label>
                  <Controller
                    control={control}
                    name="birth_date"
                    render={({ field }) => (
                      <DatePicker
                        className={`bg-white px-2 py-2 rounded w-full border border-[#1C304A] border-opacity-50 placeholder:text-[#1C304A] placeholder:text-opacity-50 placeholder:text-lg placeholder:font-normal min-w-48 ${
                          errors.birth_date
                            ? "border-red-600 border-2"
                            : "border-[#193B67] border-opacity-15"
                        }`}
                        selected={
                          field.value
                            ? parse(field.value, "dd/MM/yyyy", new Date())
                            : parsedDate
                        }
                        onChange={(date) => {
                          handleDatePickerChange(date);
                          field.onChange(format(date, "dd/MM/yyyy")); // Actualiza el valor del input
                        }}
                        yearDropdownItemNumber={90}
                        maxDate={new Date()}
                        scrollableYearDropdown
                        showYearDropdown
                        dateFormat={"dd/MM/yyyy"}
                        locale={locale}
                        placeholderText="Seleccione fecha"
                        icon={
                          <FiCalendar className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 text-2xl" />
                        }
                        showIcon
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    DNI
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.dni && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="Ingrese su DNI"
                    {...register("dni", { required: true })}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full gap-4">
                <div className="flex flex-col w-full gap-2">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Correo electrónico
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none
               ${errors.email && "border-red-600 border-2"}`}
                    type="text"
                    placeholder="Ingrese su correo electrónico"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-3 sm:gap-6">
                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Teléfono (opcional)
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.phone_number && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="ejemplo: 11 5585-2901"
                    {...register("phone_number", { required: true })}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Teléfono 2
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#1C304A] placeholder:text-opacity-50 
               placeholder:text-lg placeholder:font-normal border border-[#1C304A] border-opacity-50 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.alternative_phone_number && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="ejemplo: 11 5585-2901"
                    {...register("alternative_phone_number", {
                      required: false,
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <Button
                  type="submit"
                  className="bg-[#006AF5] text-white font-medium text-lg"
                >
                  Guardar
                </Button>
                <Button
                  type="button"
                  className="bg-white text-[#006AF5] font-light text-lg"
                  onClick={handleOnCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardWhite>
        </div>
        <Toaster position="top-right" />
      </>
    )
  );
}

AddPatients.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setModalIsVisible: PropTypes.func.isRequired,
  setPacientes: PropTypes.func.isRequired,
};

