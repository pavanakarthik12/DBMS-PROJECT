import React, { createContext, useContext, useState } from 'react';

const DashboardRefreshContext = createContext();

export const useDashboardRefresh = () => useContext(DashboardRefreshContext);

export const DashboardRefreshProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <DashboardRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
            {children}
        </DashboardRefreshContext.Provider>
    );
};
