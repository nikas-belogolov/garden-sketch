"use client"

import { Shape } from "react-konva";
import type Konva from "konva";
import { useCallback } from "react";

type CursorShapeProps = {
    x?: number;
    y?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    scale?: number;
};

/**
 * A custom Konva shape that renders a classic mouse cursor pointer
 * with slightly rounded corners for a modern look.
 */
export default function CursorShape({
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
            // Improve performance - cursor doesn't need hit detection
            listening={false}
            perfectDrawEnabled={false}
        />
    );
}
