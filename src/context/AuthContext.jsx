import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            getMe()
                .then((json) => setUser(json))
                .catch(() => {
                    localStorage.removeItem("auth_token");
                    setUser(null);
                })
                .finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, []);

    const saveUser = (userData, token) => {
        localStorage.setItem("auth_token", token);
        setUser(userData);
    };

    const clearUser = () => {
        localStorage.removeItem("auth_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser: saveUser, clearUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
