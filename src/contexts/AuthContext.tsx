import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    type User,
    signOut as firebaseSignOut
} from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAILS = ['korieydixon@yahoo.com'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setUserLoggedIn(true);
                setIsAdmin(user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function logout() {
        return firebaseSignOut(auth);
    }

    const value = {
        currentUser,
        userLoggedIn,
        isAdmin,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
