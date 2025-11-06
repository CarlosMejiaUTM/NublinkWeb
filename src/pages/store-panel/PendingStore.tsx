// FileName: PendingStore.tsx
// Path: src/pages/store-panel/PendingStore.tsx

import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const PendingStore = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Tu tienda está pendiente</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Hemos recibido tu solicitud de registro. Nuestro equipo está revisando los datos 
          de tu tienda. Te notificaremos por correo electrónico cuando sea aprobada.
        </p>
        <Button
          as={Link}
          to="/login"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
};

export default PendingStore;
