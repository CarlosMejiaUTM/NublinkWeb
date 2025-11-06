// FileName: RejectedStore.tsx
// Path: src/pages/store-panel/RejectedStore.tsx

import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const RejectedStore = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Tu tienda fue rechazada</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Lamentamos informarte que tu tienda no ha sido aprobada. 
          Si crees que se trata de un error o deseas más información, comunícate con nuestro equipo de soporte.
        </p>
        <a
          href="mailto:soporte@nublink.com"
          className="block text-blue-600 font-semibold underline mb-8"
        >
          Contactar soporte
        </a>
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

export default RejectedStore;
