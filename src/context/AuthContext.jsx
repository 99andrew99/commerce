import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    console.log("현재 유저는: ", currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe; // 컴포넌트가 언마운트될 때 리스너 해제
    }, []);

    const value = { currentUser };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
