"use client"

import { useGarden } from "@/lib/context/GardenContext";
import { useAwareness } from "@/lib/hooks/useAwareness";
import type Konva from "konva";
import { useCallback, useEffect, useRef } from "react";
import { Group, Layer, Shape, Text } from "react-konva";

type CursorShapeProps = {
    x?: number;
    y?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    scale?: number;
};

 function CursorShape({
    x = 0,
    y = 0,
    fill = "#000",
    stroke = "#fff",
    strokeWidth = 1.5,
    scale = 1,
}: CursorShapeProps) {

    const sceneFunc = useCallback((context: Konva.Context, shape: Konva.Shape) => {
        const s = scale;

        // Paper plane body (Dart shape pointing to top-left 0,0)
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(23 * s, 9 * s);  // Right wing tip (slimmer)
        context.lineTo(14 * s, 14 * s); // Tail notch
        context.lineTo(9 * s, 23 * s);  // Left wing tip (slimmer)
        context.closePath();

        // Fill and stroke the main body
        context.fillStrokeShape(shape);
    }, [scale]);

    return (
        <Shape
            x={x}
            y={y}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            sceneFunc={sceneFunc}
            listening={false}
            perfectDrawEnabled={false}
        />
    );
}


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
        <>
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
        </>
    )
}