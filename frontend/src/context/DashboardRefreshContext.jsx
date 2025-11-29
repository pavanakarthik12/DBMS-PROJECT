import React, { createContext, useContext, useState } from 'react';

const DashboardRefreshContext = createContext();

export const useDashboardRefresh = () => {
    const context = useContext(DashboardRefreshContext);
    if (!context) {
        throw new Error('useDashboardRefresh must be used within DashboardRefreshProvider');
    }
    return context;
};

export const DashboardRefreshProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerDashboardRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <DashboardRefreshContext.Provider value={{ refreshTrigger, triggerDashboardRefresh }}>
            {children}
        </DashboardRefreshContext.Provider>
    );
};
