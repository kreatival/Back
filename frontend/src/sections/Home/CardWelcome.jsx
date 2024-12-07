import CardWhite from "../../components/CardWhite";
import BannerHome from "../../assets/ImageFilter.svg";
import BannerAdmin from "../../assets/BannerAdmin.jpg";
import { PiIdentificationCard } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineTeam } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineSnippets } from "react-icons/ai";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo } from "react";
import { apiGetUserById } from "../../api/users/apiUsers";
import { userStore } from "../../context/userStore";
import { useState } from "react";

export default function CardWelcome() {
  const [isLoading, setIsLoading] = useState(true);
  // se obtiene el estado global de la variable user y para guardar el usuario
  const { user, setUser } = userStore();
  const token = localStorage.getItem("token");
  const decoded = useMemo(() => {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Invalid token", e);
      window.location.href = "/iniciar-sesion";
    }
  }, [token]);

  useEffect(() => {
    if (!user && decoded) {
      const getUsersByIdToken = async () => {
        try {
          const response = await apiGetUserById(decoded.user_id);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        } finally {
          setIsLoading(false);
        }
      };
      getUsersByIdToken();
    } else {
      setIsLoading(false); //en caso de que ya se haya cargado el usuario se cambia el estado de isLoading a false
    }
  }, [decoded, user, setUser]);

  const nombrePerfil = useMemo(() => {
    if (decoded) {
      return decoded.last_name === "User"
        ? decoded.first_name
        : `${decoded.first_name} ${decoded.last_name}`;
    }
    return null;
  }, [decoded]);

  const role = decoded.role;

  return (
    <div className="bg-[#fafdff] mr-2 max-w-[1126px] w-full lg:px-28 sm:px-8 px-4 pt-6">
      <CardWhite className="sm:gap-6 gap-2.5">
        <div className="w-full h-40 sm:h-[197.058px] bg-center flex justify-center items-center">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <img
              src={role === "admin" ? BannerAdmin : BannerHome}
              alt="Banner"
              className="object-cover w-full h-full rounded-t-lg"
            />
          )}
        </div>
        <div className="flex justify-center bg-white">
          <p className="text-xl font-normal sm:text-2xl">
            Bienvenido, {nombrePerfil}
          </p>
        </div>
        <div className="w-full bg-[#f3f5f7] flex flex-col gap-2 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={"/pacientes"}
              className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all"
            >
              <PiIdentificationCard className="text-4xl text-[#c0d2ff] mr-2" />
              <p className="text-xl font-extralight">Pacientes</p>
            </Link>
            <Link
              to={"/agenda"}
              className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all"
            >
              <AiOutlineCalendar className="text-4xl text-[#c0d2ff] mr-2" />
              <p className="text-xl font-extralight">Agenda</p>
            </Link>
            {role === "admin" ? (
              <Link
                to={"/usuarios"}
                className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all"
              >
                <AiOutlineTeam className="text-4xl text-[#c0d2ff] mr-2" />
                <p className="text-xl font-extralight">Usuarios</p>
              </Link>
            ) : (
              <Link
                to={"/perfil"}
                className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all"
              >
                <AiOutlineUser className="text-4xl text-[#c0d2ff] mr-2" />
                <p className="text-xl font-extralight">Perfil</p>
              </Link>
            )}
          </div>
          {role === "admin" ? (
            <div className="flex justify-center w-full">
              <div className="flex sm:flex-row flex-col gap-2 max-w-[718px] w-full">
                <Link
                  to={"/perfil"}
                  className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all"
                >
                  <AiOutlineUser className="text-4xl text-[#c0d2ff] mr-2" />
                  <p className="text-xl font-extralight">Perfil</p>
                </Link>
                <Link
                  to={"/info-clinica"}
                  className="flex rounded items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all min-h-[52px]"
                >
                  <AiOutlineSnippets className="text-4xl text-[#c0d2ff] mr-2" />
                  <p className="text-xl font-extralight">
                    Información de la clínica
                  </p>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </CardWhite>
    </div>
  );
}

