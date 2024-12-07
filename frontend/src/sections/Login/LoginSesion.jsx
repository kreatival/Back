import Button from "../../components/Button";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassWord";
import loginSchema from "../../validations/login";
import CardWhite from "../../components/CardWhite";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiLogin } from "../../api/apiLogin";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Screen from "../../assets/Screen.jpg";
import { FiArrowLeft } from "react-icons/fi";

const LoginSesion = () => {
  const navigate = useNavigate();
  const [formFailed, setFormFailed] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Manejo del envío del formulario
  const onSubmit = async (data) => {
    toast
      .promise(
        apiLogin(data), // Llamada a la API
        {
          loading: "Iniciando sesión...",
          success: "Inicio de sesión exitoso",
          error: "Error al iniciar sesión",
        }
      )
      .then((response) => {
        // Guardar el token y redirigir al /home
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          window.location.href = "/inicio";
        }, 450);
      })
      .catch((error) => {
        setFormFailed(true);
        // Comprueba si el error tiene una propiedad 'error', si no usa un mensaje por defecto
        setFormMessage(
          error.error
            ? error.error + ", vuelva a intentarlo"
            : "Error desconocido. Por favor, intente más tarde."
        );
      });
  };
  const handleForgetPassword = () => {
    navigate("/recuperar-contrasenia");
  };
  return (
    <>
      <div
        className="flex flex-col sm:justify-center w-full sm:items-center bg-cover bg-center bg-no-repeat sm:h-[calc(100vh-62px)] h-[calc(100vh-54px)] sm:px-0 px-4 sm:py-0 py-4 gap-4"
        style={{
          backgroundImage: `url(${Screen})`,
        }}
      >
        <CardWhite className="bg-white px-6 py-8 rounded-lg gap-[34px] max-w-[568px] w-full">
          <div className="sm:w-full">
            <h2 className="text-start text-[32px] font-medium leading-9 tracking-tight text-gray-900">
              Iniciar sesión
            </h2>
          </div>

          <div className="sm:w-full">
            <form
              className="space-y-6"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium leading-6 text-[#1B2B41] text-opacity-70"
                >
                  Correo electrónico
                </label>
                <div className="">
                  <Input
                    placeholder="Ingrese su correo electrónico"
                    type="text"
                    className="block w-full border-[#1C304A] border-opacity-50"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-lg font-medium leading-6 text-[#1B2B41] text-opacity-70"
                  >
                    Contraseña
                  </label>
                </div>
                <div>
                  <InputPassword
                    placeholder="Ingrese su contraseña"
                    className="block w-full border-[#1C304A] border-opacity-50"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-error">{errors.password.message}</p>
                  )}
                  {formFailed && <p className="text-error">{formMessage}</p>}
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-2">
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md px-6 bg-mainBlue py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-hoverBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar sesión
                </Button>
                <Button
                  onClick={handleForgetPassword}
                  type="button"
                  className="flex w-full justify-center rounded-md px-6 bg-white py-1.5 text-lg font-normal leading-6 text-textBlue"
                >
                  Olvidé mi contraseña
                </Button>
              </div>
            </form>
          </div>
        </CardWhite>
        <div
          className="sm:flex hidden border-2 border-[#006AF5] text-[#005FDB] py-2 px-4 rounded items-center gap-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft className="text-2xl" />
          <p className="font-medium text-lg">Volver al inicio</p>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default LoginSesion;
