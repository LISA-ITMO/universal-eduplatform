import React, { createContext, FC, ReactNode, useState } from 'react';

interface User {
    info: Record<string, unknown>;
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({ info: {} });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
