import { GardenProvider } from "@/lib/context/GardenContext";

import "../app.css"
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/context/AuthContext";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/auth/login")
    }

    return (
        <AuthProvider initialUser={session.user}>
            <GardenProvider>
                {children}
            </GardenProvider>
        </AuthProvider>
    );
}
