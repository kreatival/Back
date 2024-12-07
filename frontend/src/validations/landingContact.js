import { z } from "zod";

export const landingContactSchema = z.object({
  first_name: z
    .string()
    .nonempty({ message: "El nombre es requerido" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "El nombre no debe contener números ni caracteres especiales",
    }),
  last_name: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, {
      message: "El apellido no debe contener números ni caracteres especiales",
    })
    .optional(),
  email: z.string().email({ message: "El correo electrónico es inválido" }),
  phone_number: z
    .string()
    .nonempty({ message: "El teléfono es requerido" })
    .regex(/^\d{10}$/, {
      message: "El número de teléfono debe tener 10 dígitos",
    })
    .refine((value) => !/(\d)\1{9}/.test(value), {
      message: "El número de teléfono no puede ser repetitivo",
    }),
  issue_detail: z
    .string()
    .max(250, {
      message: "El detalle del problema no debe exceder los 250 caracteres",
    })
    .optional(),
});
