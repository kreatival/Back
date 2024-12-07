import { create } from "zustand";

export const clinicalStore = create((set) => ({
  //aca se definen los estados iniciales
  clinics: [],
  isLoading: true,
  modalEditVisible: false,
  valueData: { id: 1, data: "", description: "" },

  // aca se definen las funciones que se van a usar para modificar el estado
  setClinics: (clinics) => set({ clinics }), // va entre llaves porque es un objeto que se va a modificar
  setIsLoading: (isLoading) => set({ isLoading }),
  openModal: (valueData) => set({ modalEditVisible: true, valueData }),
  closeModal: () =>
    set({
      modalEditVisible: false,
      valueData: { id: 1, data: "", description: "" },
    }),
  updateClinic: (updatedClinic) =>
    set((state) => ({
      clinics: state.clinics.map((clinic) =>
        clinic.data === updatedClinic.data
          ? { ...clinic, description: updatedClinic.description }
          : clinic
      ),
    })),
}));
