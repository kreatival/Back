import { z } from "zod";

const addPatientSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  last_name: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  birth_date: z.string().nonempty("Este campo es requerido"),
  dni: z
    .string()
    .max(11, { message: "El DNI debe tener como máximo 11 caracteres" })
    .nonempty("Este campo es requerido"),
  email: z
    .string()
    .email({ message: "El correo electrónico debe tener un formato válido" }),
  phone_number: z
    .string()
    .min(9, { message: "El teléfono debe tener al menos 9 caracteres" }),
  alternative_phone_number: z.string().optional(),
});

export default addPatientSchema;
