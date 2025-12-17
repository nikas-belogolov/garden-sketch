import { currentShapeBoundBoxAtom, selectedIdsAtom, shapeAtomFamily, stageDraggabilityAtom, stagePosititionAtom, stageScaleAtom, stageSizeAtom, imperialToPixels, MeasurementUnit, measurementUnitAtom, metricToPixels, snapToGridAtom, selectedShapesAtom } from "@/lib/garden-canvas";
import { useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useEffectEvent, useRef } from "react";
import { Transformer } from "react-konva";

export default function ShapeTransformer() {

    const transformerRef = useRef<Konva.Transformer>(null);

    const currentShapeBoundBox = useAtomValue(currentShapeBoundBoxAtom);
    const stagePosition = useAtomValue(stagePosititionAtom)
    const stageScale = useAtomValue(stageScaleAtom);
    const snapToGrid = useAtomValue(snapToGridAtom)
    const measurementUnit = useAtomValue(measurementUnitAtom)

    const selectedShapes = useAtomValue(selectedShapesAtom)

    useEffect(() => {
        if (!transformerRef.current) return;

        transformerRef.current.nodes(selectedShapes);
    }, [selectedShapes])

    return (
        <Transformer

            

            keepRatio={false}
            ref={transformerRef}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotationSnapTolerance={5}
            rotateAnchorOffset={30}
            borderStroke="oklch(0.50 0.14 145)"
            borderStrokeWidth={2}
            anchorSize={12}
            anchorCornerRadius={6}
            anchorStyleFunc={(anchor) => {
                const primaryColor = "oklch(0.50 0.14 145)";

                // Common styles for all anchors to ensure reset
                anchor.stroke(primaryColor);
                anchor.strokeWidth(2);
                anchor.cornerRadius(10); // Make them circular

                if (anchor.name() === 'rotater') {
                    anchor.fill(primaryColor);
                    // Make rotator slightly larger and offset it more
                    anchor.width(16);
                    anchor.height(16);
                    anchor.offset({ x: 8, y: 8 }); // Center the larger anchor
                } else {
                    anchor.fill('white');
                    // Reset size for other anchors in case they were changed
                    anchor.width(12);
                    anchor.height(12);
                }
            }}
            boundBoxFunc={(oldBox, newBox) => {
                if (!currentShapeBoundBox) return newBox;

                const { width: minWidth, height: minHeight } = currentShapeBoundBox;

                return {
                    width: Math.max(minWidth * stageScale, newBox.width),
                    height: Math.max(minHeight * stageScale, newBox.height),
                    rotation: newBox.rotation,
                    x: newBox.width < minWidth * stageScale ? oldBox.x : newBox.x,
                    y: newBox.height < minHeight * stageScale ? oldBox.y : newBox.y,
                };
            }}

            anchorDragBoundFunc={(oldPos, newPos) => {
                if (!snapToGrid ||
                    transformerRef.current?.getActiveAnchor() === 'rotater') {
                    return newPos;
                }

                // Snap to grid when close to grid lines
                const gridSize = (
                    measurementUnit == MeasurementUnit.Metric ?
                        metricToPixels(0.5) : // 50px (half-meter)
                        imperialToPixels(1) // 1 feet
                ) * stageScale;
                const snapThreshold = 10; // Snap when within 10px of a grid line

                // Convert to stage-relative coordinates
                const relativeX = newPos.x - stagePosition.x;
                const relativeY = newPos.y - stagePosition.y;

                // Calculate remainder (distance from previous grid line)
                const remainderX = relativeX % gridSize;
                const remainderY = relativeY % gridSize;

                // Distance to nearest grid line (could be before or after)
                const distToNearestX = Math.min(Math.abs(remainderX), Math.abs(gridSize - remainderX));
                const distToNearestY = Math.min(Math.abs(remainderY), Math.abs(gridSize - remainderY));

                // Snap to nearest grid line if within threshold
                const snappedRelativeX = distToNearestX < snapThreshold
                    ? Math.round(relativeX / gridSize) * gridSize
                    : relativeX;

                const snappedRelativeY = distToNearestY < snapThreshold
                    ? Math.round(relativeY / gridSize) * gridSize
                    : relativeY;

                // Convert back to layer coordinates
                return {
                    x: snappedRelativeX + stagePosition.x,
                    y: snappedRelativeY + stagePosition.y,
                };
            }}
        />
    )
}