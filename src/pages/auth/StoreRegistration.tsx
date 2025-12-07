// FileName: StoreRegistration.tsx
// Path: src/pages/auth/StoreRegistration.tsx

import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SearchableSelect from '../../components/common/SearchableSelect';
import { Link } from 'react-router-dom';
import PaymentForm from '../../components/common/PaymentForm';
import { registerStore, getCategories } from '../../services/api';
import type { StoreRegistrationData, Category } from '../../types';

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  MagnifyingGlassIcon,
  CheckIcon,
  SparklesIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/solid';

// --- ARREGLO VISUAL LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER = { lat: 20.9673702, lng: -89.5925857 };

// --- COMPONENTES DEL MAPA ---
const MapRecenter = ({ coords }: { coords: { lat: number; lng: number } | null }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.flyTo([coords.lat, coords.lng], 16, { duration: 1.5 });
    }, [coords, map]);
    return null;
};

const LocationMarker = ({ coords, onLocationSelect }: any) => {
    useMapEvents({
        click(e) { fetchAddressFromCoords(e.latlng.lat, e.latlng.lng); },
    });

    const fetchAddressFromCoords = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data?.display_name) {
                const shortAddress = data.display_name.split(',').slice(0, 4).join(',');
                onLocationSelect({ lat, lng }, shortAddress);
            }
        } catch (error) { console.error(error); onLocationSelect({ lat, lng }, "Ubicación seleccionada"); }
    };
    return coords ? <Marker position={[coords.lat, coords.lng]} /> : null;
};

// --- COMPONENTES UI MEJORADOS ---

// 1. Wizard Header Responsive y Elegante
const WizardHeader = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const steps = [
    { id: 1, name: 'Negocio' },
    { id: 2, name: 'Cuenta' },
    { id: 3, name: 'Plan' },
    { id: 4, name: 'Pago' },
  ];

  return (
    <div className="w-full mb-10">
      {/* Versión Móvil: Simple */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-2">
           <span className="text-sm font-bold text-gray-700">Paso {currentStep} de {totalSteps}</span>
           <span className="text-xs text-emerald-600 font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      {/* Versión PC: Stepper completo */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-100 -z-10"></div>
        
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 
                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                  isActive ? 'bg-white border-emerald-500 text-emerald-600 shadow-lg ring-4 ring-emerald-50' : 
                  'bg-white border-gray-200 text-gray-300'}`}>
                {isCompleted ? <CheckIcon className="w-6 h-6" /> : <span className="text-sm font-bold">{step.id}</span>}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>{step.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Tarjeta de Plan
const PlanCard = ({ planName, price, features, isSelected, onSelect, isPremium }: any) => (
  <div 
    onClick={onSelect} 
    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full
      ${isSelected 
        ? (isPremium ? 'border-indigo-500 bg-indigo-50/50 shadow-xl ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-800 bg-gray-50 shadow-lg ring-2 ring-gray-800 ring-opacity-20') 
        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'}
    `}
  >
    {isPremium && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Más Popular
        </span>
    )}
    <div className="flex justify-between items-center mb-4 mt-2">
        <h3 className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{planName}</h3>
        {isSelected && <CheckCircleIcon className={`w-6 h-6 ${isPremium ? 'text-indigo-600' : 'text-gray-900'}`} />}
    </div>
    <div className="mb-6">
      <div className="flex items-baseline">
        <span className="text-4xl font-extrabold text-gray-900">${price}</span>
        <span className="text-gray-500 text-sm font-medium ml-1">/mes</span>
      </div>
    </div>
    <ul className="space-y-3 mb-6 flex-grow">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
          <CheckIcon className={`w-5 h-5 flex-shrink-0 ${isPremium ? 'text-indigo-500' : 'text-emerald-500'}`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
        variant={isSelected ? 'primary' : 'outline'} 
        className={`w-full rounded-xl py-3 font-semibold ${isSelected && isPremium ? 'bg-indigo-600 hover:bg-indigo-700 border-transparent text-white' : ''}`}
    >
        {isSelected ? 'Seleccionado' : 'Elegir Plan'}
    </Button>
  </div>
);

// --- ESTADO INICIAL ---
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

// --- COMPONENTE PRINCIPAL ---
const StoreRegistrationPage = () => {
  const [formData, setFormData] = useState<RegistrationFormState>(() => {
    const savedDraft = sessionStorage.getItem(STORAGE_KEY);
    return savedDraft ? { ...JSON.parse(savedDraft), step: 1 } : initialState;
  });

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'Cargando...' }]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [flyToCoords, setFlyToCoords] = useState<{lat: number, lng: number} | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryOptions(categories.map((cat: Category) => ({ value: cat.id.toString(), label: cat.name })));
      } catch { setCategoryOptions([{ value: '', label: 'Error' }]); }
    };
    loadCategories();
  }, []);

  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData)); }, [formData]);

  const nextStep = () => setFormData((prev) => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setFormData((prev) => ({ ...prev, step: prev.step - 1 }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleMapClickResult = (coords: { lat: number; lng: number }, address: string) => {
    setFormData((prev) => ({ ...prev, coords, address }));
  };

  const handleAddressSearch = async () => {
    if (!formData.address || formData.address.length < 5) { alert("Dirección muy corta"); return; }
    setIsSearchingAddress(true);
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
        const data = await res.json();
        if (data?.[0]) {
            const newCoords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            setFormData(prev => ({ ...prev, coords: newCoords }));
            setFlyToCoords(newCoords); 
        } else { alert("Dirección no encontrada."); }
    } catch { alert("Error al buscar."); } finally { setIsSearchingAddress(false); }
  };

  const handleStepSubmit = () => {
    if (formData.step === 1 && (!formData.business_name || !formData.owner_name || !formData.address || !formData.category_id || !formData.coords)) return alert('Completa todos los datos.');
    if (formData.step === 2 && (!formData.user_name || !formData.user_email || !formData.phone || !formData.password || !formData.username)) return alert('Completa los datos de cuenta.');
    if (formData.step === 3 && !formData.plan_id) return alert('Selecciona un plan.');
    nextStep();
  };

  const handlePaymentSubmit = async (paymentMethodId?: string, error?: string) => {
    setApiError(null);
    setIsSubmitting(true);
    if (error) { setApiError(error); setIsSubmitting(false); return; }
    try {
      await registerStore({
        ...formData,
        category_id: formData.category_id!,
        latitude: formData.coords!.lat.toString(),
        longitude: formData.coords!.lng.toString(),
        map_url: `geo:${formData.coords!.lat},${formData.coords!.lng}`,
        status: 'pending',
        role: 'store',
        plan_id: formData.plan_id!,
        payment_method_id: paymentMethodId!,
      });
      nextStep();
    } catch (e: any) { setApiError(e.message || 'Error del servidor'); } finally { setIsSubmitting(false); }
  };

  const totalSteps = 4;
  const isSuccess = formData.step > totalSteps;

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">¡Todo Listo!</h2>
                <p className="text-gray-600 mb-8 text-lg">Tu tienda ha sido registrada exitosamente. Hemos enviado un correo de confirmación.</p>
                <Link to="/login"><Button className="w-full rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transition-all">Ir a Iniciar Sesión</Button></Link>
            </div>
        </div>
    );
  }

  // --- LAYOUT CORREGIDO (Resuelve el problema de corte) ---
  return (
    <div className="flex min-h-screen bg-white">
      
      {/* LADO IZQUIERDO: FORMULARIO */}
      {/* Usamos w-full en móvil y lg:w-1/2 en escritorio. min-h-screen asegura que llene la pantalla */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white z-10 relative">
        
        {/* Contenedor con scroll propio si es necesario */}
        <div className="flex-grow overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12">
            <div className="max-w-xl mx-auto w-full">
                
                {/* Header */}
                <div className="mb-10 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-6 lg:hidden shadow-lg shadow-indigo-200">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Registra tu negocio</h2>
                    <p className="text-gray-500 text-lg">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline decoration-2 decoration-transparent hover:decoration-indigo-500 transition-all">Inicia sesión</Link>
                    </p>
                </div>

                {/* Stepper */}
                <WizardHeader currentStep={formData.step} totalSteps={totalSteps} />

                {/* Contenido Dinámico */}
                <div className="animate-fadeIn min-h-[400px]">
                    {formData.step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input id="business_name" label="Nombre comercial" value={formData.business_name} onChange={handleChange} icon={<BuildingStorefrontIcon />} placeholder="Ej. Tacos El Rey" />
                                <Input id="owner_name" label="Propietario" value={formData.owner_name} onChange={handleChange} icon={<UserIcon />} placeholder="Tu nombre" />
                            </div>
                            
                            <SearchableSelect 
                                id="category_id"
                                label="Categoría"
                                options={categoryOptions}
                                value={formData.category_id}
                                onChange={(val) => setFormData(prev => ({...prev, category_id: parseInt(val)}))}
                                icon={<TagIcon className="h-5 w-5 text-gray-400" />}
                                placeholder="Selecciona el giro de tu negocio"
                            />
                            
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4 text-indigo-600" /> Ubicación del Local
                                </label>
                                <div className="flex gap-2 mb-4">
                                    <div className="flex-grow">
                                        <Input id="address" value={formData.address} onChange={handleChange} placeholder="Calle, número, colonia, ciudad..." containerClassName="mb-0" icon={null} className="bg-white" />
                                    </div>
                                    <button 
                                        onClick={handleAddressSearch} 
                                        disabled={isSearchingAddress} 
                                        className="w-12 h-[42px] flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-md disabled:opacity-70"
                                        title="Buscar en mapa"
                                    >
                                        {isSearchingAddress ? <span className="animate-spin text-lg">↻</span> : <MagnifyingGlassIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="h-60 w-full rounded-xl overflow-hidden border border-gray-300 relative z-0 shadow-inner">
                                    <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap' />
                                        <MapRecenter coords={flyToCoords} />
                                        <LocationMarker coords={formData.coords} onLocationSelect={handleMapClickResult} />
                                    </MapContainer>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Mueve el pin si la ubicación no es exacta.</p>
                            </div>

                            <textarea id="description" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-0 outline-none text-sm resize-none transition-all placeholder-gray-400" rows={3} placeholder="Describe brevemente a qué se dedica tu negocio..." value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    )}

                    {formData.step === 2 && (
                        <div className="space-y-5 max-w-md mx-auto">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-6">
                                <UserCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <p className="text-sm text-blue-800">Estos datos serán tus credenciales de administrador para gestionar la tienda.</p>
                            </div>
                            <Input id="user_name" label="Nombre Completo" value={formData.user_name} onChange={handleChange} icon={<UserIcon />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input id="username" label="Usuario" value={formData.username} onChange={handleChange} icon={<UserCircleIcon />} />
                                <Input id="phone" label="Teléfono" value={formData.phone} onChange={handleChange} icon={<DevicePhoneMobileIcon />} />
                            </div>
                            <Input id="user_email" label="Correo Electrónico" value={formData.user_email} onChange={handleChange} icon={<EnvelopeIcon />} />
                            <Input id="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} icon={<LockClosedIcon />} />
                        </div>
                    )}

                    {formData.step === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                            <PlanCard planName="Básico" price="200" features={['Gestión de Inventario', 'Aparición en Mapa', 'Soporte por Email']} isSelected={formData.plan_id === 'basico'} onSelect={() => setFormData(p => ({...p, plan_id: 'basico'}))} />
                            <PlanCard planName="IA Premium" price="500" features={['Todo lo del Básico', 'Asistente de Ventas IA', 'Soporte Prioritario 24/7', 'Analítica Avanzada']} isSelected={formData.plan_id === 'premium'} onSelect={() => setFormData(p => ({...p, plan_id: 'premium'}))} isPremium={true} />
                        </div>
                    )}

                    {formData.step === 4 && (
                        <div className="space-y-8 max-w-md mx-auto">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm text-center">
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">Resumen</p>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{formData.plan_id === 'premium' ? 'Plan IA Premium' : 'Plan Básico'}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-extrabold text-indigo-600">${formData.plan_id === 'premium' ? '500' : '200'}</span>
                                    <span className="text-gray-500 font-medium">MXN / mes</span>
                                </div>
                            </div>
                            <PaymentForm onSubmit={handlePaymentSubmit} isProcessing={isSubmitting} submitButtonText="Pagar y Activar Tienda" />
                            {apiError && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">{apiError}</div>}
                        </div>
                    )}
                </div>

                {/* Footer Navegación */}
                <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-4 sm:static sm:pb-0">
                    {formData.step > 1 ? (
                        <button onClick={prevStep} type="button" disabled={isSubmitting} className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                            <span>Atrás</span>
                        </button>
                    ) : <div />}
                    
                    {formData.step < 4 && (
                        <Button onClick={handleStepSubmit} className="rounded-full px-8 py-3 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 font-bold tracking-wide">
                            Siguiente
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* 2. LADO DERECHO: IMAGEN (Oculto en móvil) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900">
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Imagen abstracta o decorativa */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center p-16 xl:p-24 text-white z-10">
                <div className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-8 shadow-lg">
                    <SparklesIcon className="w-4 h-4 text-yellow-300" />
                    <span>Plataforma #1 para Pymes</span>
                </div>
                
                <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                    Impulsa tu negocio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">Inteligencia</span>
                </h1>
                
                <p className="text-lg text-indigo-100 mb-10 max-w-lg leading-relaxed font-light">
                    Automatiza inventarios, gestiona clientes y recibe pedidos en línea. Todo integrado en una sola plataforma diseñada para crecer contigo.
                </p>
                
                <div className="grid grid-cols-2 gap-6 max-w-md">
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                        <p className="text-3xl font-bold mb-1">98%</p>
                        <p className="text-indigo-200 text-sm">Satisfacción de clientes</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                        <p className="text-3xl font-bold mb-1">24/7</p>
                        <p className="text-indigo-200 text-sm">Soporte técnico IA</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Estilos para animaciones de fondo */}
      <style>{`
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default StoreRegistrationPage;