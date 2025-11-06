// FileName: PaymentForm.tsx
// Path: src/components/common/PaymentForm.tsx

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from './Button';
import Input from './Input'; // Importamos el Input mejorado

// --- Iconos SVG para UI Profesional ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const LoadingSpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
// --- Fin de Iconos ---

// Estilos para el CardElement (coincide con el Input)
const cardElementOptions = {
  style: {
    base: {
      color: "#1A1A1A", // text-main
      fontFamily: '"Public Sans", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "15px",
      "::placeholder": {
        color: "#6B7281", // text-muted
      },
    },
    invalid: {
      color: "#e53e3e", // Rojo para error
      iconColor: "#e53e3e",
    },
  },
};

interface PaymentFormProps {
  // Corregimos la firma de onSubmit para que coincida con el código de registro
  onSubmit: (paymentMethodId?: string, error?: string) => Promise<void>; 
  isProcessing: boolean;
  submitButtonText?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onSubmit, 
  isProcessing, 
  submitButtonText = "Activar Plan" 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardName, setCardName] = useState('');

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCardError(null); // Limpia errores previos

    if (!stripe || !elements) {
      console.error("Stripe.js aún no ha cargado.");
      onSubmit(undefined, "Stripe no está listo, espera un momento."); // Llama a onSubmit con error
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card Element no se encontró.");
      onSubmit(undefined, "Error al encontrar el formulario de tarjeta."); // Llama a onSubmit con error
      return;
    }

    // 1. Crear el PaymentMethod
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardName,
      },
    });

    if (error) {
      console.error("Error de Stripe:", error);
      setCardError(error.message || "Error al procesar la tarjeta.");
      onSubmit(undefined, error.message || "Error al procesar la tarjeta."); // Llama a onSubmit con error
    } else if (paymentMethod) {
      console.log('PaymentMethod creado:', paymentMethod);
      // 2. Llama a la función onSubmit del padre con el ID del PaymentMethod
      await onSubmit(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      
      {/* --- ¡MEJORA! Input con icono --- */}
      <Input
        id="cardName"
        label="Nombre en la Tarjeta"
        placeholder="Juan Pérez"
        required
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        icon={<UserIcon />} // <-- Icono de usuario añadido
      />
      
      <div>
        {/* --- ¡MEJORA! Label con icono --- */}
        <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-1.5">
          <CreditCardIcon /> {/* <-- Icono de tarjeta añadido */}
          Datos de la Tarjeta
        </label>
        
        {/* --- ¡MEJORA! Borde de error dinámico --- */}
        <div className={`
          w-full px-4 py-3 border bg-secondary rounded-lg shadow-sm
          ${cardError ? 'border-red-500 ring-1 ring-red-500' : 'border-line-light'}
        `}>
            <CardElement options={cardElementOptions} />
        </div>
        
        {/* --- ¡MEJORA! Estilo de error coherente --- */}
        {cardError && <p className="mt-1.5 text-xs text-red-600">{cardError}</p>}
      </div>
      
      <Button
        type="submit"
        className="w-full !mt-6"
        size="lg"
        disabled={!stripe || isProcessing} // Botón deshabilitado si Stripe no carga o está procesando
      >
        {/* --- ¡MEJORA! Icono de carga --- */}
        {isProcessing && <LoadingSpinnerIcon />}
        {isProcessing ? 'Procesando...' : submitButtonText}
      </Button>
    </form>
  );
};

export default PaymentForm;