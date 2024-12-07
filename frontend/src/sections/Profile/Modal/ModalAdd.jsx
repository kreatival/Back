import { useState } from 'react';
import CardWhite from '../../../components/CardWhite';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import reasonSchema from '../../../validations/addReason';
import { useForm, Controller } from "react-hook-form";
import TimeInput from "../../../components/TimeInput";
import { createReason } from '../../../api/reasons/reasons-services';
import { Toaster, toast } from "react-hot-toast";

const ModalAdd = ({ isVisible, setModalIsVisible }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(reasonSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await createReason(data);
      if (response.status === 201) {
        toast.success("El motivo se creó con éxito");
        setTimeout(() => {
          window.location.href = "/perfil";
        }, 500);
      }
    } catch (error) {
      
      toast.error("No se pudo crear el motivo");
    }
  };

  const handleCancel = () => {
    setModalIsVisible(false);
  };

  return (
    isVisible && (
      <>
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center px-1 items-center z-50">
          <CardWhite className="w-[568px] bg-white pt-[48px] p-[24px]">
            <h2 className="text-[24px] font-semibold text-[#192739] mb-6">
              Añadir Motivo
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Motivo *
                </label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Ingrese el motivo"
                  className="mt-1 block w-full"
                  {...register("description")}
                />
                {errors.description && <p className="text-error">{errors.description.message}</p>}
              </div>
              <div className="w-full relative">
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <TimeInput
                      maxTime={240} // Máximo tiempo en minutos (4 horas)
                      interval={30} // Intervalo en minutos (30 minutos)
                      onChange={field.onChange}
                      label="Tiempo del Motivo *"
                    />
                  )}
                />
                {errors.time && <p className="text-error">{errors.time.message}</p>}
              </div>
              <div className="flex flex-col">
                <Button type="submit" className="flex bg-mainBlue items-center justify-center text-white px-4 py-2 rounded">
                  Añadir motivo
                </Button>
                <Button type="button" onClick={handleCancel} className="flex items-center justify-center text-mainBlue px-4 py-2 rounded">
                  Volver
                </Button>
              </div>
            </form>
          </CardWhite>
        </div>
        
        <Toaster position="top-right" />
      </>
    )
  );
};

export default ModalAdd;
