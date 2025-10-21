// FileName: StoreSettings.tsx
// Path: src/pages/store-panel/StoreSettings.tsx

import React, { useState } from 'react';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const StoreSettingsPage = () => {
    // Estado para manejar la pestaña activa
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <DashboardLayout
            pageTitle="Settings"
            pageDescription="Manage your store profile, account, and configurations."
        >
            {/* Pestañas de Navegación */}
            <div className="mb-6 border-b border-line-light">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'account' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Account
                    </button>
                     <button
                        onClick={() => setActiveTab('location')}
                        className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'location' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Location
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'payments' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Payments
                    </button>
                </nav>
            </div>

            {/* Contenido de las Pestañas */}
            <Card>
                {activeTab === 'profile' && (
                    <form className="space-y-4">
                        <h3 className="text-lg font-semibold mb-3">Store Profile</h3>
                        <Input id="storeName" label="Store Name" defaultValue="My Hardware Store" />
                        <Input id="storePhone" label="Contact Phone" type="tel" defaultValue="+1234567890" />
                        <Input id="storeSchedule" label="Opening Hours" defaultValue="Mon-Fri 9am-6pm" />
                        <Input id="storeLogo" label="Update Logo" type="file" />
                        <div>
                           <label htmlFor="storeDescription" className="block text-sm font-medium text-text-main mb-1.5">Description</label>
                           <textarea id="storeDescription" rows={3} className="w-full px-4 py-2.5 border border-line-light rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-secondary placeholder-text-muted/60 text-sm" defaultValue="Your friendly local hardware store..."></textarea>
                        </div>
                        <div className="pt-4 text-right">
                            <Button type="submit">Save Profile Changes</Button>
                        </div>
                    </form>
                )}

                {activeTab === 'account' && (
                    <form className="space-y-4">
                        <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
                        <Input id="accountEmail" label="Email Address" type="email" defaultValue="david@example.com" disabled />
                        <Input id="currentPassword" label="Current Password" type="password" />
                        <Input id="newPassword" label="New Password" type="password" />
                        <Input id="confirmPassword" label="Confirm New Password" type="password" />
                         <div className="pt-4 text-right">
                            <Button type="submit">Update Password</Button>
                        </div>
                    </form>
                )}
                 {activeTab === 'location' && (
                     <div>
                        <h3 className="text-lg font-semibold mb-3">Store Location</h3>
                        <Input id="storeAddress" label="Address" defaultValue="123 Main St, Anytown, USA" />
                         <div className="h-64 bg-secondary rounded-lg flex items-center justify-center border border-dashed border-line-light mt-4">
                            <p className="text-text-muted text-sm">[ Map Placeholder - Edit Location Pin ]</p>
                        </div>
                        <div className="pt-4 text-right">
                            <Button type="submit">Update Location</Button>
                        </div>
                     </div>
                 )}

                {activeTab === 'payments' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
                        <p className="text-text-muted text-sm mb-4">Connect your accounts to receive online payments.</p>
                        <div className="space-y-3">
                            <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700">Connect with Stripe</Button>
                            <Button type="button" className="w-full bg-cyan-500 hover:bg-cyan-600">Connect with MercadoPago</Button>
                             {/* Mostrar estado si ya está conectado */}
                             <p className="text-xs text-text-muted">Stripe: <span className="text-green-600 font-medium">Connected</span></p>
                        </div>
                    </div>
                )}
            </Card>
        </DashboardLayout>
    );
};

export default StoreSettingsPage;