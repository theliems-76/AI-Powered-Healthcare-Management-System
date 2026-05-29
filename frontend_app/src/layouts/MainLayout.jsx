import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import Sidebar from './Sidebar';
import Header from './Header';
import FeedbackWidget from '../components/ui/FeedbackWidget';

export default function MainLayout() {
    const { user, logout } = useContext(AuthContext);
    
    const[isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
            
            {}
            <Sidebar 
                user={user} 
                isMobileOpen={isMobileOpen} 
                setIsMobileOpen={setIsMobileOpen} 
            />

            {}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F8F9FB]">
                
                {}
                <Header 
                    user={user} 
                    logout={logout} 
                    toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} 
                />

                {}
                {}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    <Outlet />
                </div>
                
            </main>
            
            {/* Global Floating Actions */}
            {user?.role === 'PATIENT' && <FeedbackWidget />}
        </div>
    );
}