import { useDecode } from "./useDecode";

export function useAuth() {
  const token = localStorage.getItem("token");
  const decoded = useDecode(token);
  const tokenExist = !!token; // Convierte el token en un valor booleano

  const isAdmin = decoded?.role === "admin";
  const isAdminOrSecretary = (decoded?.role === "admin" || decoded?.role === "secretary");
  
  const hasValidRole =
    decoded &&
    (decoded.role === "admin" ||
      decoded.role === "secretary" ||
      decoded.role === "dentist");

  return { tokenExist, isAdmin, hasValidRole, isAdminOrSecretary };
}
