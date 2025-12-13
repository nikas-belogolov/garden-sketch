import { createContext, useContext, useState } from "react";


type AuthContextState = {
    user: any;
}

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({
    children
}: React.PropsWithChildren) {

    const [user, setUser] = useState();

    return <AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth must be used within an AuthProvider.")

    return context;
}