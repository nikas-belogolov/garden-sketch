import { useGarden } from "@/lib/context/GardenContext";
import { Group, Layer, Text } from "react-konva";
import { useAwareness } from "@/lib/hooks/useAwareness";
import CursorShape from "./CursorShape";
import { useEffect, useRef } from "react";
import Konva from "konva";

export default function Cursors() {
    const { doc } = useGarden()

    const awareness = useAwareness()

    const groupRef = useRef<Konva.Group>(null)

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.cache();
        }
    }, [])

    return (
        <Layer listening={false} name="cursors">
            {
                awareness.map(({ clientID, user, cursor }) => {

                    if (clientID == doc.clientID) return null;

                    return (
                        <Group ref={groupRef} x={cursor.x} y={cursor.y} key={clientID}>
                            <CursorShape
                                fill={user.color}
                                stroke="#fff"
                                strokeWidth={1.5}
                                scale={1.2}
                            />
                            <Text
                                perfectDrawEnabled={false}
                                x={16}
                                y={18}
                                text={user.name}
                                fontSize={16}
                                fill={user.color}
                                fontStyle="bold"
                            />
                        </Group>

                    )
                })
            }
        </Layer>
    )
}