import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
import {
    onAuthStateChanged,
    type User,
    signOut as firebaseSignOut
} from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    isAdmin: boolean;
    userPermissions: string[] | null;
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
    const [userPermissions, setUserPermissions] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let generation = 0;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const request = ++generation;
            setIsAdmin(false);
            setUserPermissions(null);
            if (user) {
                setLoading(true); // IMPORTANT: Set loading to true while checking Firestore
                setCurrentUser(user);
                setUserLoggedIn(true);

                // Check if user has admin role in Firestore
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (request !== generation) return;

                    if (userDoc.exists()) {
                        const data = userDoc.data();

                        setIsAdmin(data.role === 'admin');
                        setUserPermissions(data.role === 'admin' ? data.permissions || null : null);
                    }
                } catch (error) {
                    if (request !== generation) return;
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
                setIsAdmin(false);
            }
            if (request === generation) setLoading(false);
        });

        return () => { generation++; unsubscribe(); };
    }, []);

    async function logout() {
        return firebaseSignOut(auth);
    }

    const value = {
        currentUser,
        userLoggedIn,
        isAdmin,
        userPermissions,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
