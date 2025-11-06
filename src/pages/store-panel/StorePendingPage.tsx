// FileName: StorePendingPage.tsx
// Path: src/pages/store-panel/StorePendingPage.tsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ClockIcon, ExclamationCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'; // Usa /20/solid como tus otros archivos

const StorePendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // El estado 'status' se pasa desde ProtectedRoute
  const status = location.state?.status || 'pendiente'; 

  const getStatusDetails = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <ClockIcon className="w-16 h-16 text-yellow-500" />,
          title: 'Tu tienda está en revisión',
          message: 'Hemos recibido tu solicitud. Nuestro equipo la está revisando y te notificaremos por correo electrónico una vez que sea aprobada. Este proceso suele tardar de 24 a 48 horas.'
        };
      case 'rejected':
        return {
          icon: <ExclamationCircleIcon className="w-16 h-16 text-red-500" />,
          title: 'Tu solicitud ha sido rechazada',
          message: 'Lamentablemente, tu solicitud no pudo ser aprobada en este momento. Por favor, revisa tu correo electrónico para ver los detalles y los siguientes pasos.'
        };
      default:
        return {
          icon: <ClockIcon className="w-16 h-16 text-gray-500" />,
          title: 'Estado de tienda desconocido',
          message: 'Hay un problema con el estado de tu tienda. Por favor, contacta a soporte.'
        };
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const { icon, title, message } = getStatusDetails();

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="max-w-lg w-full text-center shadow-xl">
        <div className="p-8 flex flex-col items-center">
          {icon}
          <h2 className="mt-6 text-2xl font-bold text-text-main">{title}</h2>
          <p className="mt-3 text-base text-text-muted">
            {message}
          </p>
          <p className="mt-6 text-sm text-text-muted">
            No es necesario que te quedes en esta página. Puedes cerrar sesión y volver más tarde.
          </p>
          <Button 
            onClick={handleLogout} 
            variant="secondary" 
            className="mt-6"
custom-class="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button> 
        </div>
      </Card>
    </div>
  );
};

export default StorePendingPage;