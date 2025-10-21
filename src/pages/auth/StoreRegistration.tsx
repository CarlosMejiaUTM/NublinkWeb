// FileName: StoreRegistration.tsx
// Path: src/pages/auth/StoreRegistration.tsx

import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout'; // Usa el layout específico

// Componente para el encabezado del formulario wizard dentro de AuthLayout
const WizardHeader = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="text-center mb-8">
        {/* Subtítulo dinámico para el paso actual */}
        <p className="text-text-muted mt-2 text-sm">Step {currentStep} of {totalSteps}</p>
        {/* Barras de progreso */}
        <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalSteps)].map((_, index) => (
                <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-colors duration-300 ${index + 1 <= currentStep ? 'bg-primary' : 'bg-secondary'}`}
                ></div>
            ))}
        </div>
    </div>
);

// Componente para el mensaje de éxito
const SuccessMessage = () => (
    <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto text-green-600 mb-6">
            {/* Icono de check SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-text-main mt-4">Registration Successful!</h2>
        <p className="text-text-muted mt-2 max-w-sm mx-auto text-base">
            Your store has been submitted. Our team will review your information and you'll be notified by email within 24 hours.
        </p>
        <div className="mt-8">
            <Link to="/login">
                <Button size="lg">Go to Login</Button>
            </Link>
        </div>
    </div>
);

// Placeholder para el mapa
const MapPlaceholder = () => (
    <div className="h-64 bg-secondary rounded-lg flex items-center justify-center border border-dashed border-line-light">
        <p className="text-text-muted text-sm">Interactive Map (Google Maps API)</p>
    </div>
);

// --- Componente Principal ---
const StoreRegistrationPage = () => {
    // Estado para controlar el paso actual del wizard
    const [step, setStep] = useState(1);
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Número total de pasos (sin contar el de éxito)
    const totalSteps = 4;
    // Variable para saber si estamos en el último paso (éxito)
    const isSuccessStep = step === totalSteps + 1;

    // Manejador del envío del formulario (avanza al siguiente paso)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de validación antes de avanzar
        if (!isSuccessStep) { // Evita avanzar si ya está en éxito
             nextStep();
        }
    };

    // Opciones para el <Select> de tipo de negocio
    const businessTypeOptions = [
        { value: '', label: 'Select Type of business' },
        { value: 'grocery', label: 'Grocery Store' },
        { value: 'hardware', label: 'Hardware Store' },
        { value: 'clothing', label: 'Clothing Boutique' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'other', label: 'Other' },
    ];

    // --- Renderizado del Componente ---
    return (
      // Usamos AuthLayout que ya incluye Header y Footer
      <AuthLayout
          title="Register your business"
          // El subtítulo cambia según si es un paso normal o el de éxito
          subtitle={isSuccessStep ? undefined : `Let's get you set up.`}
      >
            {/* Muestra el encabezado del wizard solo si no es el paso de éxito */}
            {!isSuccessStep && <WizardHeader currentStep={step} totalSteps={totalSteps} />}

            {/* Muestra el mensaje de éxito solo en el último paso */}
            {isSuccessStep && <SuccessMessage />}

            {/* Muestra el formulario solo si NO es el paso de éxito */}
            {!isSuccessStep && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Paso 1: Detalles del Negocio --- */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-text-main mb-3">Business Details</h2>
                            <Input id="businessName" label="Name of business" placeholder="Ej. Tienda de abarrotes 'La Esquina'" required/>
                            <Input id="companyName" label="Company Name" isOptional={true}/>
                            <Select
                                id="businessType"
                                label="Type of business"
                                options={businessTypeOptions}
                                required
                            />
                            <Input id="rfc" label="RFC" isOptional={true}/>
                            <Input id="email" label="Email" type="email" placeholder="example@domain.com" required/>
                            <Input id="password" label="Password" type="password" placeholder="••••••••" required/>
                        </div>
                    )}

                    {/* --- Paso 2: Ubicación --- */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-text-main mb-3">Location Information</h2>
                            <Input id="address" label="Full Address" placeholder="Street, City, State, Zip Code" required/>
                            <MapPlaceholder />
                            <Input id="reference" label="Reference" placeholder="e.g. Next to the park, in front of the church" isOptional={true}/>
                        </div>
                    )}

                    {/* --- Paso 3: Perfil Visual --- */}
                    {step === 3 && (
                         <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-text-main mb-3">Visual Profile & Schedule</h2>
                            <Input id="logo" label="Logo" type="file" accept="image/*" required/>
                            <Input id="coverImage" label="Cover Image" type="file" accept="image/*" isOptional={true}/>
                            <Input id="schedule" label="Opening Hours" placeholder="Mon-Fri 9am-6pm, Sat 9am-2pm" required/>
                            <div>
                               <label htmlFor="description" className="block text-sm font-medium text-text-main mb-1.5">Short Description</label>
                               <textarea
                                  id="description"
                                  rows={3}
                                  maxLength={300}
                                  className="w-full px-4 py-2.5 border border-line-light rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-secondary placeholder-text-muted/60 text-sm"
                                  placeholder="Tell us a little about your business..."
                                  required
                               ></textarea>
                            </div>
                        </div>
                    )}

                    {/* --- Paso 4: Pagos --- */}
                    {step === 4 && (
                         <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-text-main mb-3">Payment Setup</h2>
                            <p className="text-text-muted text-base mb-4">Allow your customers to pay you online securely.</p>
                            <div className="space-y-4">
                                <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700">Connect with Stripe</Button>
                                <Button type="button" className="w-full bg-cyan-500 hover:bg-cyan-600">Connect with MercadoPago</Button>
                                <div className="pt-2 flex items-center gap-2">
                                    <input id="no-payment" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-line-light rounded"/>
                                    <label htmlFor="no-payment" className="block text-sm text-text-main">I'll only accept reservations (no online payment)</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Botones de Navegación --- */}
                    <div className={`mt-8 flex ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                        {/* Botón "Atrás" (solo visible desde el paso 2 en adelante) */}
                        {step > 1 && (
                            <Button onClick={prevStep} variant="secondary" type="button">Go Back</Button>
                        )}
                        {/* Botón "Siguiente" o "Finalizar" */}
                        <Button type="submit">
                            {step === totalSteps ? 'Finish Registration' : 'Next Step'}
                        </Button>
                    </div>
                </form> // Cierre de la etiqueta form
            )} {/* Cierre del condicional !isSuccessStep */}
      </AuthLayout> 
    ); // Cierre del return
}; // Cierre del componente

export default StoreRegistrationPage;