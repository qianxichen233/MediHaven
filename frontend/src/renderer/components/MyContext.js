// MyContext.js
import React, { createContext, useContext, useState } from 'react';
import { decodeMessage, decodeSender } from '../utils/utils';

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        role: '',
        email: '',
        messages: [],
    });

    window.electron.ipcRenderer.on('chat', (data) => {
        console.log(`inside renderer: ${JSON.stringify(data)}`);
        const { role, email } = decodeSender(data.message.from);

        setUser((user) => {
            const msg = [...user.messages];
            msg.push({
                role,
                email,
                ...decodeMessage(data.message.message),
            });
            return {
                ...user,
                messages: msg,
            };
        });
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
