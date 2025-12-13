'use client';
import { createContext, useContext, useMemo, useReducer, useRef, useState } from "react";
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ShapeProps } from "@/app/app/garden/[gardenId]/common";
import { TypedMap } from "yjs-types";

const doc = new Y.Doc()
const yName = doc.getText("name")
const yObjects = doc.getMap("objects") as Y.Map<ShapeProps>;
const undoManager = new Y.UndoManager([
    yName,
    yObjects
])

type State = {
    ydoc: Y.Doc;
    doc: Y.Doc;
    objectsMap: Y.Map<ShapeProps>;
    undoManager: Y.UndoManager
}

const GardenContext = createContext<State | undefined>(undefined);

function GardenProvider({
    children,
}: React.PropsWithChildren) {

    // TODO: Fetch ydoc and apply an update

    const gardenId = "123"
    // const wsProvider = useRef(new WebsocketProvider('ws://localhost:1234', gardenId, doc))

    return (
        <GardenContext.Provider value={{
            ydoc: doc,
            doc,
            objectsMap: yObjects,
            undoManager
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