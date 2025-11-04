import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (name, username, email, password) => {
        const res = await API.post("/api/users/register", { name, username, email, password });
        console.log(res);
        const token = res.data.user.token;
        console.log(token);
        localStorage.setItem("token", token);
        console.log(res.data.user);
        setUser(res.data.user);
    };

    const login = async (email, password) => {
        const res = await API.post("/api/users/login", { email, password });
        const token = res.data.user.token;
        localStorage.setItem("token", token);
        setUser(res.data.user);
    };

    const logout = async () => {

        await API.post("/api/users/logout");
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) return setLoading(false);
            try {
                const res = await API.get("/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch {
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
