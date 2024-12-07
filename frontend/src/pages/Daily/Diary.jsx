import { useState } from "react";
import ScheduleShift from "../../sections/ShiftManager/Modal/ScheduleShift";
import EditShift from "../../sections/ShiftManager/Modal/EditShift";

export default function Diary() {
  const [modalShiftIsVisible, setModalShiftIsVisible] = useState(false);
  const [modalEditIsVisible, setModalEditIsVisible] = useState(false);

  const handleOpenModalAdd = () => {
    setModalShiftIsVisible(true);
  };

  const handleOpenModalEdit = () => {
    setModalEditIsVisible(true);
  };

  return (
    <>
      <div>
        Diary
        <button className="bg-red-500" onClick={handleOpenModalAdd}>
          Agregar turno
        </button>
        <button className="bg-blue-500" onClick={handleOpenModalEdit}>
          Editar turno
        </button>
      </div>
      {modalShiftIsVisible && (
        <ScheduleShift
          isVisible={modalShiftIsVisible}
          setModalShiftIsVisible={setModalShiftIsVisible}
        />
      )}
      {modalEditIsVisible && (
        <EditShift
          isVisible={modalEditIsVisible}
          setModalEditIsVisible={setModalEditIsVisible}
        />
      )}
    </>
  );
}

