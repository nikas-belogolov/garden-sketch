import { useEffect, useState } from "react";
import { useGarden } from "../context/GardenContext";

type AwarenessState = {
    clientID: number;
    user: {
        name: string;
        color: string;
    }
    cursor: {
        x: number;
        y: number;
    }
}

export function useAwareness() {
    const { awareness } = useGarden()

    const [awarenessState, setAwarenessState] = useState<AwarenessState[]>([])

    useEffect(() => {
        if (!awareness) return
        
        const handleAwarenessChange = () => {

            const states = Array.from(awareness.getStates(), ([clientID, state]) => ({
                clientID,
                user: state.user,
                cursor: state.cursor || { x: 0, y: 0 }
            })) as AwarenessState[];

            setAwarenessState(states)
        }

        awareness.on('change', handleAwarenessChange)

        return () => {
            awareness.off('change', handleAwarenessChange)
        }
    }, [awareness])

    return awarenessState
}