import { z } from "zod";

const reasonSchema = z.object({
  time: z
    .string({required_error: "El tiempo es obligatorio",})
    .min(1, { message: "El tiempo es obligatorio" }), // Verifica que el campo no esté vacío
  description: z
    .string()
    .min(1, "El motivo es obligatorio")
    .max(100, "El motivo no puede exceder los 100 caracteres"),
});

export default reasonSchema;

