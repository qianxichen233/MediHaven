// MyContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        role: '',
        email: '',
    });

    return (
        <MyContext.Provider value={{ user, setUser }}>
            {children}
        </MyContext.Provider>
    );
};

// Custom hook to consume the context
export const useMyContext = () => {
    return useContext(MyContext);
};
