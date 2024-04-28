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

    window.electron.ipcRenderer.on('chat_msg', (data) => {
        console.log(`inside renderer: ${JSON.stringify(data)}`);

        const { role, email } = decodeSender(data.message.from);

        setUser((user) => {
            const msg = [...user.messages];

            const message_body = decodeMessage(data.message.message);

            if (
                msg.reduce((prev, cur) => {
                    return prev || cur.uuid == message_body.uuid;
                }, false)
            )
                return user;

            msg.push({
                role,
                email,
                ...message_body,
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
