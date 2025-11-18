import React, { useState, useEffect } from 'react';
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import type { Store, User } from '../../types';
import { getStoreProfile, updateStoreProfile, getStoreSubscription } from '../../services/api';
import LocationPickerMap from '../../components/common/LocationPickerMap'; 

// --- Iconos ---
import { 
    UserCircleIcon, 
    KeyIcon, 
    MapPinIcon, 
    CreditCardIcon,
    BuildingStorefrontIcon,
    PhoneIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/20/solid';
import AddressAutocomplete from '@/components/common/AddressAutocomplete';
import { useNavigate } from 'react-router-dom';

  // --- (Spinner y Error) ---
  const LoadingSpinner = () => (
      <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
      <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0"/>
          <div className="text-left">
              <p className="font-semibold">Error al Cargar</p>
              <p className="text-sm">{message}</p>
          </div>
      </div>
  );


  type SettingsTab = 'profile' | 'account' | 'location' | 'payments';
  type ModalState = 'confirm' | 'loading' | 'success' | 'error' | 'closed';

  const StoreSettingsPage = () => {
      const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

      // --- Estados ---
const [profileData, setProfileData] = useState<Partial<User & Store & { 
  user_id?: number; 
  store_id?: number;
}>>({});
      const navigate = useNavigate();
      const [originalStoreId, setOriginalStoreId] = useState<number | null>(null);
      const [isLoadingProfile, setIsLoadingProfile] = useState(true);
      const [profileError, setProfileError] = useState<string | null>(null);

      const [subscription, setSubscription] = useState<any>(null);
      const [isLoadingSub, setIsLoadingSub] = useState(false);
      const [subError, setSubError] = useState<string | null>(null);

      // --- Estados para el modal unificado ---
      const [modalState, setModalState] = useState<ModalState>('closed');
      const [modalMessage, setModalMessage] = useState("");
      const [modalTitle, setModalTitle] = useState("");

      // --- Cargar perfil ---
// PRIMERO: Actualiza el useEffect de loadProfile:

useEffect(() => {
    const loadProfile = async () => {
        try {
            setIsLoadingProfile(true);
            setProfileError(null);

            const userData = await getStoreProfile();

            // ✅ CORRECCIÓN: Definir tipo explícito y convertir null a undefined
            let combinedData: Partial<User & Store & { 
                user_id?: number; 
                store_id?: number;
            }>;
            
            if (userData.store) {
                combinedData = { 
                    // Propiedades del usuario
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone ?? undefined, // ✅ Convertir null a undefined
                    role: userData.role,
                    user_id: userData.id,
                    
                    // Propiedades de la tienda
                    business_name: userData.store.business_name,
                    owner_name: userData.store.owner_name,
                    address: userData.store.address,
                    description: userData.store.description ?? undefined,
                    category: userData.store.category ?? undefined,
                    category_id: userData.store.category_id ?? undefined,
                    status: userData.store.status,
                    is_verified: userData.store.is_verified,
                    store_id: userData.store.id,
                    latitude: userData.store.latitud || userData.store.latitude,
                    longitude: userData.store.longitud || userData.store.longitude,
                    map_url: userData.store.map_url ?? undefined,
                    logo_url: userData.store.logo_url ?? undefined,
                    schedule: userData.store.schedule ?? undefined,
                };
                setOriginalStoreId(userData.store.id);
            } else {
                combinedData = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone ?? undefined, // ✅ Convertir null a undefined
                    role: userData.role,
                    user_id: userData.id,
                };
                setOriginalStoreId(userData.id);
            }

            setProfileData(combinedData);

        } catch (err) {
            setProfileError(err instanceof Error ? err.message : "Error desconocido");
            setProfileData({});
            setOriginalStoreId(null);
        } finally {
            setIsLoadingProfile(false);
        }
    };
    loadProfile();
}, []);
    // --- Cargar suscripción ---
    useEffect(() => {
        const loadSubscription = async () => {
            try {
                setIsLoadingSub(true);
                setSubError(null);

                const subData = await getStoreSubscription();

                setSubscription(subData);
            } catch (err) {
                setSubError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setIsLoadingSub(false);
            }
        };
        if (activeTab === 'payments' && !subscription && !profileError) {
            loadSubscription();
        }
    }, [activeTab, subscription, profileError]);

    // --- Guardar perfil (lógica real) ---
const performSave = async () => {
    setModalState('loading');
    setModalTitle('Guardando cambios...');
    setModalMessage('Por favor espera mientras actualizamos tu perfil.');

    try {
        const dataToUpdate: Partial<User & Store> = {
            // Datos del usuario
            name: profileData.name,
            phone: profileData.phone,
            
            // Datos de la tienda
            business_name: profileData.business_name,
            owner_name: profileData.owner_name,
            address: profileData.address,
            description: profileData.description,
            latitude: profileData.latitude,
            longitude: profileData.longitude,
        };

        const updatedUser = await updateStoreProfile(dataToUpdate);
        
        if (!updatedUser) {
            throw new Error("El servidor no devolvió datos");
        }

        // ✅ CORRECCIÓN: Mapear correctamente la respuesta con tipo explícito
        let combinedData: Partial<User & Store & { 
            user_id?: number; 
            store_id?: number;
        }>;
        
        if (updatedUser.store) {
            combinedData = { 
                ...(updatedUser as any), // Casting temporal para evitar conflictos de tipos
                ...updatedUser.store,
                user_id: updatedUser.id,
                store_id: updatedUser.store.id,
                // Mapear latitud/longitud correctamente
                latitude: updatedUser.store.latitud || updatedUser.store.latitude,
                longitude: updatedUser.store.longitud || updatedUser.store.longitude,
            };
        } else {
            combinedData = {
                ...profileData,
                ...(updatedUser as any), // Casting temporal para evitar conflictos de tipos
            };
        }

        setProfileData(combinedData);
        
        if (updatedUser.store?.id) {
            setOriginalStoreId(updatedUser.store.id);
        } else if (combinedData.store_id) {
            setOriginalStoreId(combinedData.store_id);
        }
        
        setModalState('success');
        setModalTitle('¡Cambios guardados!');
        setModalMessage('El perfil de tu tienda se ha actualizado exitosamente.');
        
        setTimeout(() => {
            setModalState('closed');
        }, 5000);
        
    } catch (err) {
        let errorMsg = "Error al guardar los cambios.";
        
        if (err instanceof Error) {
            errorMsg = err.message;
        }
        
        setModalState('error');
        setModalTitle('Error al guardar');
        setModalMessage(errorMsg);
        
        setTimeout(() => {
            setModalState('closed');
        }, 5000);
    }
};

    // --- Handler del formulario (muestra modal de confirmación) ---
    const handleProfileSave = () => {
        
        setModalState('confirm');
        setModalTitle('Confirmar cambios');
        setModalMessage('¿Estás seguro de que deseas guardar los cambios realizados en el perfil?');
    };

    // --- Handlers del modal ---
    const handleConfirmSave = () => {
        performSave();
    };

    const handleCancelSave = () => {
        setModalState('closed');
    };

    // --- Handlers ---
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfileData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleMapDrag = (coords: { lat: number; lng: number }) => {
        setProfileData(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }));
    };

    // --- Pestañas ---
    const TabButton = ({ tabId, title, icon: Icon }: { tabId: SettingsTab, title: string, icon: React.ElementType }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => { 
                    setActiveTab(tabId); 
                }}
                className={`
                    flex items-center gap-3 w-full p-3 rounded-lg text-sm font-semibold transition-colors
                    ${isActive 
                        ? 'bg-secondary text-primary' 
                        : 'text-text-muted hover:bg-secondary hover:text-text-main'}
                `}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                <span>{title}</span>
            </button>
        );
    };

    // --- Renderizado ---
    const renderContent = () => {

        if (isLoadingProfile) {
            return <LoadingSpinner />;
        }

        if (profileError && !profileData.id) {
            return <ErrorMessage message={profileError} />;
        }

        if (profileData && (profileData.id || profileData.user_id)) {
            switch (activeTab) {
                case 'profile':
                    return (
                        <div className="space-y-5 max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Perfil de la Tienda</h3>
                            
                            <Input 
                                id="business_name" 
                                label="Nombre de la Tienda" 
                                value={profileData.business_name || ''} 
                                onChange={handleProfileChange} 
                                icon={<BuildingStorefrontIcon />} 
                            />
                            
                            <Input 
                                id="owner_name" 
                                label="Nombre del Propietario" 
                                value={profileData.owner_name || ''} 
                                onChange={handleProfileChange} 
                                icon={<UserCircleIcon />} 
                            />
                            
                            <Input 
                                id="phone" 
                                label="Teléfono (Usuario)" 
                                value={profileData.phone || ''} 
                                onChange={handleProfileChange} 
                                icon={<PhoneIcon />} 
                            />
                            
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-main mb-1.5">
                                    Descripción
                                </label>
                                <textarea 
                                    id="description" 
                                    rows={4} 
                                    className="w-full px-4 py-2.5 border border-line-light bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                                    placeholder="Cuéntanos un poco sobre tu negocio..." 
                                    value={profileData.description || ''} 
                                    onChange={handleProfileChange}
                                />
                            </div>
                            
                            <div className="pt-4 text-right">
                                <Button 
                                    onClick={handleProfileSave}
                                    disabled={modalState === 'loading'}
                                >
                                    {modalState === 'loading' ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        </div>
                    );

                case 'account':
                    return (
                        <div className="space-y-5 max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Cuenta y Seguridad</h3>
                            <p className="text-text-muted">Esta sección está en desarrollo...</p>
                        </div>
                    );

                case 'location':
                  return (
                    <div className="space-y-6 max-w-3xl">
                      {/* --- Encabezado --- */}
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-semibold text-text-main">
                          Ubicación de tu Tienda
                        </h3>
                      </div>

                      {/* --- Descripción --- */}
                      <p className="text-sm text-text-muted">
                        Aquí puedes visualizar y actualizar la ubicación de tu tienda. Busca una dirección o arrastra el pin en el mapa.
                      </p>

                      {/* --- Tarjeta principal --- */}
                      <div className="bg-white dark:bg-secondary border border-line-light rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-line-light">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-text-main">
                                Dirección de tu tienda
                              </h4>
                              <p className="text-xs text-text-muted">
                                {profileData.business_name || "Tienda sin nombre registrado"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="p-5 space-y-5">
                          {/* Campo de dirección con autocompletado */}
                          <div>
                            <AddressAutocomplete
                              value={profileData.address || ''}
                              onChange={(address) => {
                                setProfileData((prev) => ({ ...prev, address }));
                              }}
                              onSelectLocation={({ lat, lng, address }) => {
                                setProfileData((prev) => ({
                                  ...prev,
                                  address,
                                  latitude: lat,
                                  longitude: lng,
                                }));
                              }}
                              placeholder="Busca y selecciona tu dirección..."
                            />
                            {profileData.category && (
                              <p className="text-xs text-text-muted mt-2">
                                Categoría: {profileData.category}
                              </p>
                            )}
                          </div>

                          {/* Coordenadas actuales */}
                          <div className="bg-surface rounded-xl border border-line-light px-4 py-3">
                            <p className="text-xs font-semibold text-text-muted mb-2">Coordenadas seleccionadas:</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-text-muted">Latitud:</span>{' '}
                                <span className="font-mono text-text-main">
                                  {profileData.latitude ? Number(profileData.latitude).toFixed(6) : 'No definida'}
                                </span>
                              </div>
                              <div>
                                <span className="text-text-muted">Longitud:</span>{' '}
                                <span className="font-mono text-text-main">
                                  {profileData.longitude ? Number(profileData.longitude).toFixed(6) : 'No definida'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Mapa - ✅ ACTUALIZADO para recibir y actualizar la dirección */}
                          <div className="rounded-xl overflow-hidden border border-line-light">
                            <LocationPickerMap
                              onLocationSelect={({ lat, lng, address }) => {
                                // ✅ CORRECCIÓN CRÍTICA: Actualizar coordenadas Y dirección
                                setProfileData((prev) => ({
                                  ...prev,
                                  latitude: lat,
                                  longitude: lng,
                                  // Solo actualizar la dirección si se obtuvo una válida
                                  ...(address && { address }),
                                }));
                              }}
                              initialCenter={
                                profileData.latitude && profileData.longitude
                                  ? [Number(profileData.latitude), Number(profileData.longitude)]
                                  : [20.9674, -89.5926] // Mérida por defecto
                              }
                              showAddressInPopup={true}
                            />
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-xs text-blue-700 dark:text-blue-900">
                              💡 <strong>Consejo:</strong> Puedes buscar una dirección usando el campo de texto o hacer clic/arrastrar 
                              el marcador en el mapa. Las coordenadas y la dirección se sincronizarán automáticamente.
                            </p>
                          </div>
                        </div>
                          
                        {/* Footer con botón */}
                        <div className="px-5 py-4 border-t border-line-light bg-surface flex justify-end">
                          <button
                            onClick={handleProfileSave}
                            disabled={modalState === 'loading'}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                              modalState === 'loading'
                                ? 'bg-primary/60 cursor-not-allowed text-white'
                                : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                          >
                            {modalState === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                case 'payments':
                  return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                      <h3 className="text-xl font-semibold mb-4 text-text-main">
                        Pagos y Suscripción
                      </h3>

                      {isLoadingSub ? (
                        <LoadingSpinner />
                      ) : subError ? (
                        <ErrorMessage message={subError} />
                      ) : subscription && subscription.data ? (
                        <div className="relative bg-white dark:bg-secondary rounded-2xl shadow-lg border border-line-light p-6 transition-all hover:shadow-xl">
                          
                          {/* Encabezado */}
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-lg font-bold text-text-main flex items-center gap-2">
                                {subscription.data.plan === "premium"
                                  ? "Plan IA Premium"
                                  : "Plan Básico"}
                              </h4>
                              <p className="text-sm text-text-muted">
                                {subscription.data.plan === "premium"
                                  ? "Incluye analítica predictiva y funciones avanzadas."
                                  : "Funciones esenciales para tu tienda en el mapa."}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                subscription.data.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {subscription.data.status === "active" ? "Activo" : "Inactivo"}
                            </div>
                          </div>

                          {/* Cuerpo */}
                          <div className="grid sm:grid-cols-2 gap-4 mb-5">
                            <div className="bg-secondary/40 rounded-xl p-3">
                              <p className="text-xs text-text-muted mb-1">Inicio del período</p>
                              <p className="font-medium text-text-main">
                                {new Date(subscription.data.current_period_start).toLocaleDateString("es-MX")}
                              </p>
                            </div>

                            <div className="bg-secondary/40 rounded-xl p-3">
                              <p className="text-xs text-text-muted mb-1">Fin del período</p>
                              <p className="font-medium text-text-main">
                                {new Date(subscription.data.current_period_end).toLocaleDateString("es-MX")}
                              </p>
                            </div>

                            <div className="bg-secondary/40 rounded-xl p-3 col-span-2">
                              <p className="text-xs text-text-muted mb-1">ID de Suscripción</p>
                              <p className="font-mono text-xs text-text-muted truncate">
                                {subscription.data.stripe_subscription_id}
                              </p>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex justify-between items-center border-t border-line-light pt-4">

                            <div className="text-sm text-text-muted">
                              Próximo cobro automático al finalizar el período.
                            </div>

                            <div className="flex items-center gap-3">

                              {/* --- BOTÓN MEJORAR PLAN (solo si NO es premium) --- */}
                              {subscription.data.plan !== "premium" && (
                                <button
                                  onClick={() => navigate('/tienda/mejorar-plan')}
                                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition"
                                >
                                  Mejorar Plan
                                </button>
                              )}

                              {/* --- YA EXISTENTE: Dar de baja --- */}
                              <button
                                onClick={() => alert("Función próxima: cancelar suscripción")}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              >
                                Dar de baja
                              </button>

                            </div>
                          </div>

                          {/* Decoración */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full pointer-events-none"></div>
                        </div>
                      ) : (
                        <div className="bg-secondary/20 p-6 rounded-xl text-center text-text-muted">
                          No hay información de suscripción disponible.
                        </div>
                      )}
                    </div>
                  );


                default:
                    return <p>Pestaña desconocida</p>;
            }
        }

        return <p>No se pudieron cargar los datos.</p>;
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <Card paddingClass="p-2">
                        <nav className="flex flex-col space-y-1">
                            <TabButton tabId="profile" title="Perfil de Tienda" icon={BuildingStorefrontIcon} />
                            <TabButton tabId="account" title="Cuenta y Seguridad" icon={KeyIcon} />
                            <TabButton tabId="location" title="Ubicación" icon={MapPinIcon} />
                            <TabButton tabId="payments" title="Pagos y Suscripción" icon={CreditCardIcon} />
                        </nav>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card>
                        {renderContent()}
                    </Card>
                </div>
            </div>

            {/* Modal unificado */}
            <ConfirmModal
          isOpen={modalState !== 'closed'}
          title={modalTitle}
          message={modalMessage}
          confirmText="Guardar"
          cancelText="Cancelar"
          type={modalState === 'closed' ? 'confirm' : modalState}
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave} state={'confirm'}            />
        </>
    );
};

export default StoreSettingsPage;