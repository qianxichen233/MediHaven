// MyContext.js
import React, { createContext, useContext, useState } from 'react';
import { decodeMessage, decodeSender } from '../utils/utils';
import { MessageQueue } from '../utils/MessageQueue';

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        role: '',
        email: '',
        messages: new MessageQueue(),
        update: false,
    });

    window.electron.ipcRenderer.on('chat_msg', (data) => {
        console.log(`inside renderer: ${JSON.stringify(data)}`);

        const { role, email } = decodeSender(data.message.from);

        setUser((user) => {
            const message_body = decodeMessage(data.message.message);

            user.messages.addMessage(role, email, message_body);

            return {
                ...user,
                update: true,
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
