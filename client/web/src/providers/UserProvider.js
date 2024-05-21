import React, { createContext, useState } from 'react';

export const UserContext = createContext(null);

// TODO: UserProvider {info {id, name, description}, token, isLoading} typescript

export const UserProvider = ({ children }) => {
    // const [user, setUser] = useState({info: {}, token: null, isLoading: false});
    const [user, setUser] = useState({info: {}});

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
