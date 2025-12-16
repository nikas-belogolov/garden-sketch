'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import { Shape } from "@/app/app/garden/[gardenId]/common";
import { TypedMap } from "yjs-types";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

const doc = new Y.Doc()
const yName = doc.getText("name")
const yObjects = doc.getMap("objects") as Y.Map<Shape>;
const undoManager = new Y.UndoManager([
    yName,
    yObjects
])

type State = {
    ydoc: Y.Doc;
    doc: Y.Doc;
    objectsMap: Y.Map<Shape>;
    undoManager: Y.UndoManager
    awareness: Awareness | null
}

const GardenContext = createContext<State | undefined>(undefined);

function GardenProvider({
    children,
}: React.PropsWithChildren) {

    // TODO: Fetch ydoc and apply an update

    const { user } = useAuth()
    const router = useRouter()

    const gardenId = "123"

    const [awareness, setAwareness] = useState<Awareness | null>(null)

    useEffect(() => {
        const wsProvider = new WebsocketProvider(`ws://${window.location.host}`, gardenId, doc, {
            protocols: ['yjs'],
            connect: true
        });

        wsProvider.on('status', (event: { status: string }) => {
            console.log(event.status) // logs "connected" or "disconnected"
        });

        wsProvider.awareness.setLocalStateField("user", {
            cursor: { x: 0, y: 0 },
            color: "#fff",
            name: user?.name
        });

        setAwareness(wsProvider.awareness)

        function handleDisconnect() {
            wsProvider.disconnect();
            setAwareness(null)
        }

        document.addEventListener("beforeunload", handleDisconnect)

        return () => {
            handleDisconnect();
            document.removeEventListener("beforeunload", handleDisconnect)
        };
    }, [doc]);

    return (
        <GardenContext.Provider value={{
            ydoc: doc,
            doc,
            objectsMap: yObjects,
            undoManager,
            awareness
        }}>
            {children}
        </GardenContext.Provider>
    )
}

function useGarden() {
    const context = useContext(GardenContext);

    if (context === undefined)
        throw new Error("useGarden must be used within an GardenProvider");

    return context;
}

export { useGarden, GardenProvider }