// FileName: StoreRejectedPage.tsx
// Path: src/pages/store-panel/StoreRejectedPage.tsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ExclamationCircleIcon, ArrowLeftOnRectangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';

const StoreRejectedPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="max-w-lg w-full text-center shadow-xl">
        <div className="p-8 flex flex-col items-center">
          <ExclamationCircleIcon className="w-16 h-16 text-red-500" />
          <h2 className="mt-6 text-2xl font-bold text-text-main">Solicitud de tienda no aprobada</h2>
          <p className="mt-3 text-base text-text-muted">
            Lamentablemente, tu solicitud no pudo ser aprobada en este momento.
          </p>
          <p className="mt-4 text-base text-text-muted">
            <strong>Por favor, comunícate con soporte</strong> para conocer los motivos y cómo puedes solucionarlo.
          </p>
          <div className="flex gap-4 mt-8">
            <Button 
              onClick={handleLogout} 
              variant="secondary" 
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </Button> 
            <Link to="/soporte">
              <Button variant="primary">
                <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                Contactar a Soporte
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StoreRejectedPage;