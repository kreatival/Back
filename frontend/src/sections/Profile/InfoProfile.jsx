import CardWhite from "../../components/CardWhite";
import { useEffect } from "react";
import { apiGetUserById } from "../../api/users/apiUsers";
import { useDecode } from "../../hooks/useDecode";
import { userStore } from "../../context/userStore";

const InfoProfile = () => {
  const { user, setUser } = userStore();
  const token = localStorage.getItem("token");
  const decode = useDecode(token);

  useEffect(() => {
    const getUserData = async (userId) => {
      try {
        const response = await apiGetUserById(userId);
        setUser(response.data);
      } catch (error) {
        return null
      }
    };

    if (!user) {
      getUserData(decode.user_id);
    }
  }, [decode.user_id, user, setUser]);

  return (
    <div className="bg-white max-w-[746px] px-[16px] w-full">
      <CardWhite className=" p-[20px] sm:p-6 bg-white rounded-lg h-full flex !flex-row gap-6 items-start">
        {
          // Si no hay usuario, muestra un mensaje de cargando
          !user ? (
            <div className="flex flex-col justify-between gap-2 h-full">
              <div className="flex flex-col">
                <h2 className=" text-[20px]  sm:text-2xl text-[#192739] font-semibold">
                  Cargando...
                </h2>
                <p className="text-[#005FDB] text-sm sm:text-lg font-medium">
                  {" "}
                  Cargando...
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex sm:gap-2 sm:flex-row flex-col">
                  <p className="text-[#1B2B41] text-opacity-70 text-sm sm:text-lg font-medium">
                    DNI{" "}
                  </p>
                  <span className="text-[#1C304A] text-opacity-50 text-sm sm:text-lg font-normal">
                    Cargando...
                  </span>
                </div>
                <div className="flex sm:gap-2 sm:flex-row flex-col">
                  <p className="text-[#1B2B41] text-opacity-70 text-sm sm:text-lg font-medium">
                    Correo Electrónico{" "}
                  </p>
                  <span className="text-[#006AF5] underline text-sm sm:text-lg font-normal ml-2.5">
                    Cargando...
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-2 h-full">
              <div className="flex flex-col">
                <h2 className=" text-[20px]  sm:text-2xl text-[#192739] font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-[#005FDB] text-sm  sm:text-lg font-medium">
                  {" "}
                  {decode.role === "admin"
                    ? "Administrador"
                    : decode.role === "secretary"
                    ? "Secretario"
                    : "Odontólogo"}
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex sm:gap-2 sm:flex-row flex-col">
                  <p className="text-[#1B2B41] text-opacity-70 sm:text-lg font-medium">
                    DNI{" "}
                  </p>
                  <span className="text-[#1C304A] text-opacity-50 sm:text-lg font-normal">
                    {user.dni}
                  </span>
                </div>
                <div className="flex sm:gap-2 sm:flex-row flex-col">
                  <p className="text-[#1B2B41] text-opacity-70 text-sm sm:text-lg font-medium">
                    Correo Electrónico{" "}
                  </p>
                  <span className="text-[#8993A1] text-sm sm:text-lg font-normal">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          )
        }
      </CardWhite>
    </div>
  );
};

export default InfoProfile;
