// FileName: StoreSettings.tsx
// Path: src/pages/store-panel/StoreSettings.tsx

import React, { useState, useEffect } from 'react';
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
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
    CheckCircleIcon,
    ExclamationTriangleIcon // Icono de error
} from '@heroicons/react/20/solid';

// --- (Spinner y Error) ---
const LoadingSpinner = () => (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>);
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-center gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0"/>
        <div className="text-left">
            <p className="font-semibold">Error al Cargar</p>
            <p className="text-sm">{message}</p>
        </div>
    </div>
);
const SuccessMessage = ({ message }: { message: string }) => (
    <div className="p-3 text-center text-green-700 bg-green-100 rounded-lg border border-green-200">
        <p className="font-semibold flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            {message}
        </p>
    </div>
);
type SettingsTab = 'profile' | 'account' | 'location' | 'payments';

const StoreSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    // --- Estados para Pestaña de Perfil ---
    const [profileData, setProfileData] = useState<Partial<User & Store>>({});
    const [originalStoreId, setOriginalStoreId] = useState<number | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    // --- Estados para Pestaña de Pagos ---
    const [subscription, setSubscription] = useState<any>(null);
    const [isLoadingSub, setIsLoadingSub] = useState(false);
    const [subError, setSubError] = useState<string | null>(null);

    // --- Cargar datos del perfil de la tienda ---
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoadingProfile(true);
                setProfileError(null);
                const userData = await getStoreProfile(); // GET /web/stores/mine/profile-with-store
                
                const combinedData = { ...userData.store, ...userData };
                delete combinedData.store;
                
                setProfileData(combinedData);
                setOriginalStoreId(userData.store!.id);
            } catch (err) {
                // ¡Guarda el error que estás viendo!
                setProfileError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setIsLoadingProfile(false);
            }
        };
        loadProfile();
    }, []);

    // --- Cargar datos de suscripción ---
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
        if (activeTab === 'payments' && !subscription && !profileError) { // No cargar si el perfil ya falló
            loadSubscription();
        }
    }, [activeTab, subscription, profileError]); // Depende de profileError

    // --- Guardar Cambios ---
    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalStoreId) return;

        setIsSaving(true);
        setSaveMessage(null);
        setProfileError(null); // Limpia el error de carga

        try {
            const dataToUpdate: Partial<User & Store> = {
                business_name: profileData.business_name,
                owner_name: profileData.owner_name,
                address: profileData.address,
                description: profileData.description,
                name: profileData.name,
                phone: profileData.phone,
                latitude: profileData.latitude,
                longitude: profileData.longitude,
            };
            
            const updatedUser = await updateStoreProfile(dataToUpdate); // PATCH
            
            const combinedData = { ...updatedUser.store, ...updatedUser };
            delete combinedData.store;
            
            setProfileData(combinedData);
            setSaveMessage("¡Perfil guardado exitosamente!");
        } catch (err) {
            setProfileError(err instanceof Error ? err.message : "Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Handlers de Formulario ---
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setSaveMessage(null); 
        setProfileData(prevData => ({ ...prevData, [id]: value }));
    };
    const handleMapDrag = (coords: { lat: number; lng: number }) => {
        setSaveMessage(null);
        setProfileData(prevData => ({
            ...prevData,
            latitude: coords.lat,
            longitude: coords.lng
        }));
    };

    // --- Componente de Navegación de Pestañas ---
    const TabButton = ({ tabId, title, icon: Icon }: { tabId: SettingsTab, title: string, icon: React.ElementType }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
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

    // --- *** ¡¡CORRECCIÓN IMPORTANTE!! *** ---
    // Esta función ahora contiene la lógica de carga y error
    const renderContent = () => {
        // --- 1. Muestra el estado de carga ---
        if (isLoadingProfile) {
            return <LoadingSpinner />;
        }
        
        // --- 2. Muestra el error fatal de la API (¡Este es el que estás viendo!) ---
        if (profileError && !profileData.id) {
            return <ErrorMessage message={profileError} />;
        }
        
        // --- 3. Si no hay error y hay datos, muestra la pestaña seleccionada ---
        if (profileData.id) {
            switch (activeTab) {
                case 'profile':
                    return (
                        <form onSubmit={handleProfileSave} className="space-y-5 max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Perfil de la Tienda</h3>
                            <Input id="business_name" label="Nombre de la Tienda" value={profileData.business_name || ''} onChange={handleProfileChange} icon={<BuildingStorefrontIcon />} />
                            <Input id="owner_name" label="Nombre del Propietario" value={profileData.owner_name || ''} onChange={handleProfileChange} icon={<UserIcon />} />
                            <Input id="phone" label="Teléfono (Usuario)" value={profileData.phone || ''} onChange={handleProfileChange} icon={<PhoneIcon />} />
                            <div>
                               <label htmlFor="description" className="block text-sm font-medium text-text-main mb-1.5">Descripción</label>
                               <textarea id="description" rows={4} className="w-full px-4 py-2.5 border border-line-light bg-secondary rounded-lg..." placeholder="Cuéntanos un poco sobre tu negocio..." value={profileData.description || ''} onChange={handleProfileChange}></textarea>
                            </div>
                            {saveMessage && <SuccessMessage message={saveMessage} />}
                            {profileError && <ErrorMessage message={profileError} />}
                            <div className="pt-4 text-right">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        </form>
                    );
                
                case 'account':
                    return (
                        <form className="space-y-5 max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Cuenta y Seguridad</h3>
                            <Input id="email" label="Correo Electrónico" type="email" value={profileData.email || ''} disabled icon={<EnvelopeIcon />} />
                            <Input id="username" label="Nombre de Usuario" type="text" value={profileData.username || ''} disabled icon={<UserCircleIcon />} />
                            <hr className="border-line-light" />
                            <Input id="currentPassword" label="Contraseña Actual" type="password" placeholder="••••••••" icon={<KeyIcon />} />
                            <Input id="newPassword" label="Nueva Contraseña" type="password" placeholder="••••••••" icon={<KeyIcon />} />
                            <div className="pt-4 text-right">
                                <Button type="submit" disabled>Actualizar Contraseña (Próximamente)</Button>
                            </div>
                        </form>
                    );
                
                case 'location':
                    return (
                       <form onSubmit={handleProfileSave} className="space-y-5 max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Ubicación de la Tienda</h3>
                            <Input id="address" label="Dirección" value={profileData?.address || ""} onChange={handleProfileChange} icon={<MapPinIcon />} />
                            <div>
                               <label className="block text-sm font-medium text-text-main mb-1.5">Ajusta tu Pin (Arrastra el marcador)</label>
                               <LocationPickerMap 
                                   onLocationSelect={handleMapDrag} 
                                   initialCenter={profileData.latitude && profileData.longitude ? [profileData.latitude, profileData.longitude] : undefined}
                               />
                            </div>
                            {saveMessage && <SuccessMessage message={saveMessage} />}
                            {profileError && <ErrorMessage message={profileError} />}
                            <div className="pt-4 text-right">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Guardando..." : "Actualizar Ubicación"}
                                </Button>
                            </div>
                         </form>
                    );
                
                case 'payments':
                    return (
                        <div className="max-w-xl">
                            <h3 className="text-lg font-semibold mb-3 text-text-main">Suscripción y Pagos</h3>
                            {isLoadingSub && <LoadingSpinner />}
                            {subError && <ErrorMessage message={subError} />}
                            {!isLoadingSub && !subError && !subscription && (
                                <p className="text-text-muted">No se encontró información de suscripción.</p>
                            )}
                            {subscription && (
                                <Card className="bg-secondary-light shadow-lg">
                                    <h4 className="font-semibold text-text-main">Tu Plan Actual</h4>
                                    <p className="text-2xl font-bold text-primary mt-2">{subscription.plan?.nickname || 'Plan Desconocido'}</p>
                                    <p className="text-text-muted capitalize">Estado: <span className="font-semibold text-green-600">{subscription.status || 'desconocido'}</span></p>
                                    {subscription.current_period_end &&
                                      <p className="text-text-muted text-sm mt-1">Próximo cobro: {new Date(subscription.current_period_end * 1000).toLocaleDateString('es-MX')}</p>
                                    }
                                    <Button variant="secondary" className="mt-6" disabled>
                                        Gestionar Facturación (Próximamente)
                                    </Button>
                                </Card>
                            )}
                        </div>
                    );
            }
        }
        
        // Fallback final
        return <p>No se pudieron cargar los datos.</p>;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Columna Izquierda: Navegación de Pestañas */}
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

            {/* Columna Derecha: Contenido de la Pestaña */}
            <div className="lg:col-span-3">
                <Card>
                    {/* ¡El contenido se renderiza aquí adentro, después de las validaciones! */}
                    {renderContent()}
                </Card>
            </div>
            
        </div>
    );
};

export default StoreSettingsPage;