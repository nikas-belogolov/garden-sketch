import { GardenProvider } from "@/lib/stores/GardenContext";

import "../app.css"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GardenProvider>
            {children}
        </GardenProvider>
    );
}
