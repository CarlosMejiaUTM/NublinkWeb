// FileName: StoreRegistration.tsx
// Path: src/pages/auth/StoreRegistration.tsx

import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Card from '../../components/common/Card';
import LocationPickerMap from '../../components/common/LocationPickerMap';
import PaymentForm from '../../components/common/PaymentForm';
import { registerStore, getCategories } from '../../services/api';
import type { StoreRegistrationData, Category } from '../../types';

// Iconos
import {
  BuildingStorefrontIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  EnvelopeIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';

// --- Encabezado del Wizard ---
const WizardHeader = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="text-center mb-10 animate-fadeIn">
    <h2 className="text-2xl font-bold text-text-main mb-2">
      {currentStep === 1
        ? 'Datos de tu Tienda'
        : currentStep === 2
        ? 'Datos de tu Cuenta'
        : currentStep === 3
        ? 'Selecciona tu Plan'
        : 'Pago Seguro'}
    </h2>
    <p className="text-text-muted text-sm">Paso {currentStep} de {totalSteps}</p>
    <div className="flex justify-center mt-4 space-x-2">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 max-w-[60px] rounded-full transition-all duration-500 ${
            index + 1 <= currentStep
              ? 'bg-gradient-to-r from-primary to-indigo-500'
              : 'bg-secondary'
          }`}
        ></div>
      ))}
    </div>
  </div>
);

// --- Mensaje de éxito ---
const SuccessMessage = ({ onShow }: { onShow: () => void }) => {
  useEffect(() => {
    onShow();
  }, [onShow]);
  return (
    <div className="text-center py-10 animate-fadeInUp">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-text-main">¡Registro Exitoso!</h2>
      <p className="text-text-muted mt-3 max-w-md mx-auto text-base">
        Tu tienda ha sido registrada correctamente y está pendiente de aprobación.
        Ahora puedes iniciar sesión con tu nueva cuenta.
      </p>
      <div className="mt-8">
        <Link to="/login">
          <Button size="lg" className="bg-primary text-white rounded-full px-8 py-3 hover:brightness-110">
            Ir a Iniciar Sesión
          </Button>
        </Link>
      </div>
    </div>
  );
};

// --- Tarjeta de plan ---
const PlanCard = ({
  planName,
  price,
  features,
  isSelected,
  onSelect,
}: {
  planName: string;
  price: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={`relative cursor-pointer bg-surface rounded-2xl p-6 transition-all duration-300 border ${
      isSelected ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'border-line-light hover:shadow-lg hover:border-primary/50'
    }`}
  >
    {isSelected && (
      <div className="absolute top-4 right-4 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
        ✓
      </div>
    )}
    <h3 className="text-xl font-semibold text-text-main text-center">{planName}</h3>
    <p className="text-3xl font-extrabold text-text-main text-center my-4">
      {price}
      <span className="text-sm font-normal text-text-muted">/mes</span>
    </p>
    <ul className="space-y-2 text-sm text-text-muted mb-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Button
      variant={isSelected ? 'primary' : 'secondary'}
      className="w-full rounded-full mt-3"
      onClick={onSelect}
    >
      {isSelected ? 'Seleccionado' : 'Seleccionar'}
    </Button>
  </div>
);

// --- Estado inicial y claves ---
interface RegistrationFormState {
  step: number;
  business_name: string;
  owner_name: string;
  address: string;
  category_id: number | null;
  description: string;
  coords: { lat: number; lng: number } | null;
  user_name: string;
  user_email: string;
  password: string;
  phone: string;
  username: string;
  plan_id: 'basico' | 'premium' | null;
}
const initialState: RegistrationFormState = {
  step: 1,
  business_name: '',
  owner_name: '',
  address: '',
  category_id: null,
  description: '',
  coords: null,
  user_name: '',
  user_email: '',
  password: '',
  phone: '',
  username: '',
  plan_id: null,
};
const STORAGE_KEY = 'nublink-registration-draft-v3';

// --- Componente principal ---
const StoreRegistrationPage = () => {
  const [formData, setFormData] = useState<RegistrationFormState>(() => {
    const savedDraft = sessionStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        return { ...parsed, step: 1 };
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: 'Cargando categorías...' }]);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryError(false);
        const categories = await getCategories();
        const options = categories.map((cat: Category) => ({
          value: cat.id.toString(),
          label: cat.name,
        }));
        setCategoryOptions([
          { value: '', label: 'Selecciona una categoría...' },
          ...options,
        ]);
      } catch {
        setCategoryError(true);
        setCategoryOptions([{ value: '', label: 'Error al cargar categorías' }]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () =>
    setFormData((prev) => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () =>
    setFormData((prev) => ({ ...prev, step: prev.step - 1 }));
  const handleLocationSelected = (coords: { lat: number; lng: number }) =>
    setFormData((prev) => ({ ...prev, coords }));
  const selectPlan = (planId: 'basico' | 'premium') =>
    setFormData((prev) => ({ ...prev, plan_id: planId }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    const fieldValue =
      id === 'category_id' ? (value ? parseInt(value) : null) : value;
    setFormData((prev) => ({ ...prev, [id]: fieldValue }));
  };

  const totalVisibleSteps = 4;
  const isSuccessStep = formData.step === totalVisibleSteps + 1;

  // --- Validación por paso ---
  const handleStepSubmit = () => {
    if (formData.step === 1) {
      if (
        !formData.business_name ||
        !formData.owner_name ||
        !formData.address ||
        !formData.category_id ||
        !formData.coords
      ) {
        alert('Por favor, completa todos los datos de la tienda.');
        return;
      }
    } else if (formData.step === 2) {
      if (
        !formData.user_name ||
        !formData.user_email ||
        !formData.phone ||
        !formData.password ||
        !formData.username
      ) {
        alert('Completa todos los datos de tu cuenta.');
        return;
      }
    } else if (formData.step === 3 && !formData.plan_id) {
      alert('Selecciona un plan.');
      return;
    }
    nextStep();
  };

  // --- Envío final (registro + pago) ---
  const handlePaymentSubmit = async (paymentMethodId?: string, error?: string) => {
    setApiError(null);
    setIsSubmitting(true);

    if (error) {
      setApiError(error);
      setIsSubmitting(false);
      return;
    }

    const registrationApiData: StoreRegistrationData = {
      business_name: formData.business_name,
      owner_name: formData.owner_name,
      address: formData.address,
      category_id: formData.category_id!,
      description: formData.description || 'Sin descripción',
      latitude: formData.coords!.lat.toString(),
      longitude: formData.coords!.lng.toString(),
      map_url: `https://goo.gl/maps/example`,
      status: 'pending',
      user_name: formData.user_name,
      user_email: formData.user_email,
      password: formData.password,
      phone: formData.phone,
      username: formData.username,
      role: 'store',
      plan_id: formData.plan_id!,
      payment_method_id: paymentMethodId!,
    };

    try {
      await registerStore(registrationApiData);
      nextStep();
    } catch (backendError) {
      setApiError(
        backendError instanceof Error
          ? backendError.message
          : 'Error al conectar con el servidor.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Registra tu negocio" subtitle="Crea tu tienda paso a paso">
      {!isSuccessStep && (
        <WizardHeader currentStep={formData.step} totalSteps={totalVisibleSteps} />
      )}
      {isSuccessStep && <SuccessMessage onShow={() => sessionStorage.removeItem(STORAGE_KEY)} />}

      {!isSuccessStep && (
        <div className="space-y-6 animate-fadeInUp">
          {/* Paso 1 */}
          {formData.step === 1 && (
            <div className="space-y-5">
              <Input id="business_name" label="Nombre comercial" value={formData.business_name} onChange={handleChange} required icon={<BuildingStorefrontIcon />} />
              <Input id="owner_name" label="Propietario" value={formData.owner_name} onChange={handleChange} required icon={<UserIcon />} />
              <Select id="category_id" label="Categoría" options={categoryOptions} value={formData.category_id || ''} onChange={handleChange} required icon={<TagIcon />} />
              <Input id="address" label="Dirección" value={formData.address} onChange={handleChange} required icon={<MapPinIcon />} />
              <LocationPickerMap onLocationSelect={handleLocationSelected} />
              <textarea id="description" className="w-full px-4 py-2 rounded-lg border bg-secondary focus:ring-2 focus:ring-primary text-sm" placeholder="Descripción breve..." value={formData.description} onChange={handleChange}></textarea>
            </div>
          )}

          {/* Paso 2 */}
          {formData.step === 2 && (
            <div className="space-y-5">
              <Input id="user_name" label="Nombre Completo" value={formData.user_name} onChange={handleChange} icon={<UserIcon />} />
              <Input id="username" label="Usuario" value={formData.username} onChange={handleChange} icon={<UserCircleIcon />} />
              <Input id="user_email" label="Correo" value={formData.user_email} onChange={handleChange} icon={<EnvelopeIcon />} />
              <Input id="phone" label="Teléfono" value={formData.phone} onChange={handleChange} icon={<DevicePhoneMobileIcon />} />
              <Input id="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} icon={<LockClosedIcon />} />
            </div>
          )}

          {/* Paso 3 */}
          {formData.step === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <PlanCard
                planName="Básico"
                price="$200 MXN"
                features={['Gestión de inventario', 'Aparición en mapa', 'Modo tienda']}
                isSelected={formData.plan_id === 'basico'}
                onSelect={() => selectPlan('basico')}
              />
              <PlanCard
                planName="IA Premium"
                price="$500 MXN"
                features={['Todo lo Básico', 'Inteligencia Comercial', 'Analítica Predictiva']}
                isSelected={formData.plan_id === 'premium'}
                onSelect={() => selectPlan('premium')}
              />
            </div>
          )}

          {/* Paso 4 */}
          {formData.step === 4 && (
            <div className="space-y-6">
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                isProcessing={isSubmitting}
                submitButtonText={`Activar Plan ${
                  formData.plan_id === 'premium' ? 'IA Premium' : 'Básico'
                }`}
              />
              {apiError && (
                <p className="text-red-600 bg-red-50 p-3 rounded-md text-center border border-red-200">
                  {apiError}
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className={`mt-8 flex ${formData.step > 1 ? 'justify-between' : 'justify-end'}`}>
            {formData.step > 1 && (
              <Button onClick={prevStep} variant="secondary" type="button" disabled={isSubmitting}>
                Regresar
              </Button>
            )}
            <Button onClick={handleStepSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Cargando...' : formData.step === totalVisibleSteps - 1 ? 'Continuar al Pago' : 'Siguiente Paso'}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px) }
          100% { opacity: 1; transform: translateY(0) }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out }
      `}</style>
    </AuthLayout>
  );
};

export default StoreRegistrationPage;
