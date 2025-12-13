'use client';

import { JSX, useMemo } from "react";
import { Layer, Line } from "react-konva";
import { imperialToPixels, MeasurementUnit, measurementUnitAtom, metricToPixels, perUnitStyles, PIXELS_PER_METER } from "../../common";
import { useAtomValue } from "jotai";
import { stagePosititionAtom, stageScaleAtom } from "@/lib/stores/gardenLayoutAtoms";

export default function InfiniteGrid() {

    const stagePosition = useAtomValue(stagePosititionAtom);
    const stageScale = useAtomValue(stageScaleAtom)
    const unit = useAtomValue(measurementUnitAtom)

    const WIDTH = unit == MeasurementUnit.Metric ? metricToPixels(1) : imperialToPixels(1);
    const HEIGHT = unit == MeasurementUnit.Metric ? metricToPixels(1) : imperialToPixels(1);

    const scale = stageScale;                // e.g. group.scaleX()
    const offsetX = stagePosition.x;         // contentGroup.x()
    const offsetY = stagePosition.y;         // contentGroup.y()

    // 2) Compute the world‐space bounds of the viewport
    const worldMinX = (0 - offsetX) / scale;
    const worldMaxX = (innerWidth - offsetX) / scale;
    const worldMinY = (0 - offsetY) / scale;
    const worldMaxY = (innerHeight - offsetY) / scale;

    // 3) Snap those to your grid size
    const startX = Math.floor(worldMinX / WIDTH) * WIDTH;
    const endX = Math.ceil(worldMaxX / WIDTH) * WIDTH;
    const startY = Math.floor(worldMinY / HEIGHT) * HEIGHT;
    const endY = Math.ceil(worldMaxY / HEIGHT) * HEIGHT;

    const gridComponents = useMemo(() => {
        const gridComponents: JSX.Element[] = [];
        perUnitStyles[unit].forEach(({ spacing, lineWidth }) => {
            // Vertical lines
            for (let x = startX; x <= endX; x += spacing) {
                gridComponents.push(
                    <Line
                        key={`grid-v-${unit}-${spacing}-${x}`}
                        points={[x, startY, x, endY]}
                        stroke="black"
                        strokeWidth={lineWidth}
                    />
                );
            }

            // Horizontal lines
            for (let y = startY; y <= endY; y += spacing) {
                gridComponents.push(
                    <Line
                        key={`grid-h-${unit}-${spacing}-${y}`}
                        points={[startX, y, endX, y]}
                        stroke="black"
                        strokeWidth={lineWidth}
                    />
                );
            }
        })
        return gridComponents
    }, [startX, startY, endX, endY, unit])

    return (
        <Layer listening={false}>
            {gridComponents}
        </Layer>
    )
}