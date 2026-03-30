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

    const ADMIN_EMAILS = ['korieydixon@yahoo.com', 'denean24@hotmail.com', 'southernlpc@yahoo.com'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoading(true); // IMPORTANT: Set loading to true while checking Firestore
                setCurrentUser(user);
                setUserLoggedIn(true);

                // Check if user has admin role in Firestore
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../firebase');
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();

                        if (data.role === 'admin') {
                            setIsAdmin(true);
                        } else {
                            // Fallback to hardcoded list for initial setup/safety
                            setIsAdmin(user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);
                        }

                        setUserPermissions(data.permissions || null); // null indicates SuperAdmin with all access
                    } else {
                        // Fallback if no Firestore user document exists at all
                        setIsAdmin(user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
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
