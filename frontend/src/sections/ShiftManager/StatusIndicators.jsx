function StatusIndicators() {
  return (
    <div className="pb-3">
      <h2 className="font-semibold text-lg text-[#1b2b41a7]">Estado</h2>
      <ul className="flex flex-col gap-3 my-2">
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#006AF5]"></div>
          Confirmado
        </li>
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#FFCC00]"></div>
          Pendiente
        </li>
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#AD00FF]"></div>
          Reprogramar
        </li>
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#FF3B30]"></div>
          Cancelar
        </li>
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#34C759]"></div>
          Presente
        </li>
        <li className="inline-flex items-center">
          <div className="me-2 w-6 h-6 rounded-md bg-[#FF9500]"></div>
          Ausente
        </li>
      </ul>
    </div>
  );
}

export default StatusIndicators;
