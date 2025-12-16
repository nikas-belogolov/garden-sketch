"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authClient } from "../auth/auth-client";

import { type User } from "better-auth"


type LoginCredentials = {
    email?: string;
    password?: string;
}

type RegisterCredentials = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
}

type AuthContextState = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    isLoggedIn: boolean;
    login: (creds: LoginCredentials) => Promise<void>;
    register: (creds: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({
    children,
    initialUser = null
}: React.PropsWithChildren<{ initialUser?: User | null }>) {

    const [isLoading, setIsLoading] = useState(false)
    const [{ user, isLoggedIn, error }, setState] = useState<{
        user: User | null;
        isLoggedIn: boolean;
        error: Error | null;
    }>({
        user: initialUser,
        isLoggedIn: initialUser ? true : false,
        error: null
    });

    const login = useCallback(async (creds: LoginCredentials) => {

        setIsLoading(true)

        const { error, data } = await authClient.signIn.email({
            email: creds.email || "",
            password: creds.password || "",
        });

        setState({
            user: data?.user || null,
            isLoggedIn: error ? false : true,
            error: error ? new Error(error?.message || "Signin failed. Please try again.") : null
        });
        setIsLoading(false)
    }, []);

    const register = useCallback(async (creds: RegisterCredentials) => {
        setIsLoading(true)

        if (creds.password != creds.confirmPassword) {
            setState({
                user: null,
                isLoggedIn: false,
                error: new Error("Passwords do not match. Please confirm your password.")
            });
            setIsLoading(false);
            return;
        }

        const { error, data } = await authClient.signUp.email({
            email: creds.email || "",
            password: creds.password || "",
            name: creds.name || ""
        });

        setState({
            user: data?.user || null,
            isLoggedIn: error ? false : true,
            error: error ? new Error(error?.message || "Signup failed. Please try again.") : null
        });
        setIsLoading(false)
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true)
        const { data, error } = await authClient.signOut()

        if (error) {
            setState((prev) => ({
                ...prev,
                error: error ? new Error(error?.message || "Logout failed. Please try again.") : null
            }))
            setIsLoading(false)
            return;
        }

        setState({
            user: null,
            isLoggedIn: false,
            error: null
        })
        setIsLoading(false)
    }, [])

    return <AuthContext.Provider value={{
        user,
        error,
        isLoading,
        isLoggedIn,
        login,
        register,
        logout
    }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth must be used within an AuthProvider.")

    return context;
}