import React, { useState } from "react";
import Button from "../../components/Button";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { apiDeleteUserById } from "../../api/users/apiUsers";
import ModalDelete from "../../components/ModalDelete";
import { Toaster, toast } from "react-hot-toast";
import { useDecode } from "../../hooks/useDecode";

const TableUsers = ({ users }) => {
  const token = localStorage.getItem("token");
  const decode = useDecode(token);
  const [modalDeleted, setModalDeleted] = useState(false);
  const [userDeleted, setUserDeleted] = useState(null);

  const handleDeletedModal = (data) => {
    setModalDeleted(true);
    setUserDeleted(data);
  };

  const handleDeletedUser = async () => {
    try {
      if (userDeleted) {
        const response = await apiDeleteUserById(userDeleted.id);
        if (response.status === 200) {
          toast.success("Usuario eliminado exitosamente");
          setTimeout(() => {
            window.location.reload(); // Recargar la página después de eliminar el usuario
          }, 500);
        }
      }
    } catch (error) {
      toast.error("No se pudo eliminar el usuario");
    }
  };

  const handleRole = (role) => {
    if (role === 1) {
      return "Administrador";
    } else if (role === 2) {
      return "Secretario";
    } else if (role === 3) {
      return "Odontólogo";
    }
  };

  return (
    <div className="max-w-[744px] border pt-1 rounded-md bg-bgTable h-[20rem] overflow-y-auto">
      <table className="w-full ">
        <thead className="space-y-1">
          <tr className="space-x-3 space-y-1 rounded-md">
            <td className="w-1/4 p-1 text-center">
              <h3 className="border text-[14px] sm:text-[18px] text-mainBlue rounded-md p-2 bg-custom-gradient">
                ROL
              </h3>
            </td>
            <td className="hidden w-1/4 p-1 text-center sm:table-cell">
              <h3 className=" text-[14px] sm:text-[18px] text-mainBlue  border rounded-md p-2 bg-custom-gradient">
                DNI
              </h3>
            </td>
            <td className="w-full p-1 text-center">
              <h3 className="border text-[14px] sm:text-[18px] text-mainBlue rounded-md p-2 mr-2 bg-custom-gradient">
                NOMBRE Y APELLIDO
              </h3>
            </td>
          </tr>
        </thead>
        <tbody className="space-y-1 rounded-md">
          {users.map((user, index) => (
            <tr key={index} className="space-x-3">
              <td className="w-1/4 p-1 text-center">
                <p className="border text-[14px] sm:text-[18px]  rounded-md p-2 bg-white">
                  {handleRole(user.role_id)}
                </p>
              </td>
              <td className="hidden w-1/4 p-1 text-center sm:table-cell">
                <p className="border text-[14px] sm:text-[18px]  rounded-md p-2 bg-white">
                  {user.dni}
                </p>
              </td>
              <td className="w-full p-1">
                <div className="relative flex items-center justify-center">
                  <p className="w-full text-[14px] sm:text-[18px]  p-2 rounded-md border text-center mr-2 bg-white">
                    {user.first_name} {user.last_name}
                  </p>
                  {decode.user_id !== user.id && (
                    <Button
                      type="button"
                      onClick={() => handleDeletedModal(user)}
                      className="absolute p-1 transform -translate-y-1/2 bg-transparent right-1 sm:right-2 top-1/2"
                    >
                      <RiDeleteBin6Line className="text-[#7d8693]  text-[14px] sm:text-[18px] rounded-full hover:text-[#FF0000] hover:bg-[#FFD1D1] hover:text-opacity-100 " />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDelete
        isVisible={modalDeleted}
        setIsVisible={setModalDeleted}
        deletedModal={handleDeletedUser}
        titleModal={"Eliminar usuario"}
        infoModal={
          "¿Está seguro que quiere eliminar este usuario? Se eliminarán todos sus datos."
        }
      />
      <Toaster position="top-right" />
    </div>
  );
};

TableUsers.propTypes = {
  users: PropTypes.array.isRequired,
};

export default TableUsers;

