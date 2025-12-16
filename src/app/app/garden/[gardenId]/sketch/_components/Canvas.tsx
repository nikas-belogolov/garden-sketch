'use client';

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { DragEventHandler, MouseEvent, useCallback, useEffect, useRef } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { contextMenuIsVisibleAtom, currentDraggedObject, currentShapeBoundBoxAtom, selectedIdsAtom, stageDraggabilityAtom, stagePosititionAtom, stageScaleAtom, stageSizeAtom } from "@/lib/stores/gardenLayoutAtoms";
import InfiniteGrid from "./InfiniteGrid";

import { WebsocketProvider } from 'y-websocket'

import Konva from "konva"
import { imperialToPixels, MAX_SCALE, MeasurementUnit, measurementUnitAtom, metricToPixels, MIN_SCALE, Shape, snapToGridAtom } from "../../common";
import PlantShape from "./shapes/PlantShape";
import TreeShape from "./shapes/TreeShape";
import { Portal } from "react-konva-utils";
import BushShape from "./shapes/BushShape";
import { useGarden } from "@/lib/context/GardenContext";

import * as Y from "yjs"
import { useY } from "react-yjs";
import BaseShape from "./shapes/BaseShape";
import { nanoid } from 'nanoid'
import { KonvaEventObject } from "konva/lib/Node";
import { ContextMenu } from "./ui/ContextMenu";
import Cursors from "./Cursors";
import { useAuth } from "@/lib/context/AuthContext";

export default function Canvas() {
    const { user } = useAuth()
    const { ydoc, objectsMap, undoManager, awareness } = useGarden()

    /* STAGE */
    const [stagePosition, setStagePosition] = useAtom(stagePosititionAtom)
    const [stageSize, setStageSize] = useAtom(stageSizeAtom);
    const [stageScale, setStageScale] = useAtom(stageScaleAtom);
    const stageDraggability = useAtomValue(stageDraggabilityAtom)
    const stageRef = useRef<Konva.Stage>(null);

    const currentShapeBoundBox = useAtomValue(currentShapeBoundBoxAtom);

    /* LOCAL PREFERENCES */
    const measurementUnit = useAtomValue(measurementUnitAtom)
    const [snapToGrid, setSnapToGrid] = useAtom(snapToGridAtom)

    const shapesRef = useRef(new Map())
    const currentDraggedObjectValue = useAtomValue(currentDraggedObject)
    const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom)

    useEffect(() => {

        awareness?.setLocalStateField("user", {
            name: user?.name.split(" ")[0],
            color: '#000',
        })

        awareness?.setLocalStateField("cursor", {
            x: stagePosition.x,
            y: stagePosition.y,
        })
    }, [user, awareness])

    const handleKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
        if (e.key == "Delete") {
            e.preventDefault();
            console.log(selectedIds)
            // Delete selected shapes
            if (selectedIds.length > 0) {
                ydoc.transact(() => {
                    selectedIds.forEach(id => {
                        objectsMap.delete(id);
                    });
                });
                setSelectedIds([]);
            }
        }
        else if (e.ctrlKey && e.key == "g") {
            e.preventDefault()
            console.log(snapToGrid)
            console.log(!snapToGrid)

            setSnapToGrid(!snapToGrid);

        }
        else if (e.ctrlKey && e.key === "z") {
            e.preventDefault();
            undoManager.undo();
        }
        else if (e.ctrlKey && e.key === "y") {
            e.preventDefault();
            undoManager.redo();
        }
        else if (e.ctrlKey && e.key == "x") {
            e.preventDefault();
            if (selectedIds.length > 0) {
                ydoc.transact(() => {
                    selectedIds.forEach(id => {
                        objectsMap.delete(id);
                    });
                });
                setSelectedIds([]);
            }
        }
        else if (e.ctrlKey && e.key === "d") {
            e.preventDefault();
            // Duplicate selected shapes
            if (selectedIds.length === 1) {
                const selectedPlant = objectsMap.get(selectedIds[0]);
                if (selectedPlant) {
                    ydoc.transact(() => {
                        const newPlant = new Y.Map();
                        (selectedPlant as unknown as Y.Map<any>).forEach((value: any, key: string) => {
                            if (key === 'pos') {
                                const pos = value;
                                newPlant.set(key, {
                                    x: pos.x + 50,
                                    y: pos.y + 50
                                });
                            } else {
                                newPlant.set(key, value);
                            }
                        });

                        const newId = nanoid();
                        objectsMap.set(newId, newPlant as any);
                    });
                }
            }
        }
    }, [selectedIds]);



    const setContextMenuVisibility = useSetAtom(contextMenuIsVisibleAtom);

    useEffect(() => {
        // resizeStage is stable because setStageSize is stable
        const resizeStage = () => {
            setStageSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Run once on mount
        resizeStage();

        // const handleWindowClick = (e: MouseEvent) => {
            // if (e.)
            // setContextMenuVisibility(false);
        // };

        // window.addEventListener('click', handleWindowClick);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', resizeStage);

        return () => {
            // window.removeEventListener('click', handleWindowClick);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', resizeStage);
        };
    }, [handleKeyDown]);

    function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
        if (e.target === stageRef.current)
            setStagePosition(e.target.position());
    }

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (!stageRef.current) return;
        e.evt.preventDefault();

        const stage = stageRef.current;
        const scaleBy = 0.1;
        const oldScale = stage.scaleX();
        const newScale =
            e.evt.deltaY < 0
                ? +(oldScale + scaleBy).toFixed(2)
                : +(oldScale - scaleBy).toFixed(2);

        if (newScale > MAX_SCALE || newScale < MIN_SCALE) return;

        const { x: mouseX, y: mouseY } = stage.getPointerPosition()!;
        const worldX = (mouseX - stage.x()) / oldScale;
        const worldY = (mouseY - stage.y()) / oldScale;

        let stageX = mouseX - worldX * newScale;
        let stageY = mouseY - worldY * newScale;

        setStageScale(newScale);

        // setContextMenu({
        // visible: false,
        // x: 0,
        // y: 0
        // })
        setStagePosition({
            x: stageX,
            y: stageY
        })
    }

    const handleDrop: DragEventHandler = (e) => {
        e.preventDefault();

        if (!stageRef.current) return;

        const stage = stageRef.current;
        stage.setPointersPositions(e);

        const relativePointerPosition = stage.getRelativePointerPosition();
        if (!relativePointerPosition) return;

        const { x, y } = relativePointerPosition;

        if (currentDraggedObjectValue) {
            ydoc.transact(() => {
                const shape = new Y.Map();

                shape.set("pos", { x, y })
                shape.set("w", 100);
                shape.set("h", 100);
                shape.set("scale", { x: 1, y: 1 })

                if (currentDraggedObjectValue.type === "plant") {
                    shape.set("img", currentDraggedObjectValue.img)
                    shape.set("commonName", currentDraggedObjectValue.commonName)
                    shape.set("rowSpacing", currentDraggedObjectValue.rowSpacing);
                    shape.set("plantSpacing", currentDraggedObjectValue.plantSpacing);
                    shape.set("type", "plant")
                }

                console.log(currentDraggedObjectValue)

                objectsMap.set(nanoid(), shape as any)
            })
        }
    }

    const objects = useY(objectsMap)
    const transformerRef = useRef<Konva.Transformer>(null);

    // Clean up shapesRef when objects are deleted
    useEffect(() => {
        const currentIds = new Set(Object.keys(objects));
        const refIds = Array.from(shapesRef.current.keys());

        // Remove refs for deleted objects
        refIds.forEach(id => {
            if (!currentIds.has(id)) {
                shapesRef.current.delete(id);
            }
        });
    }, [objects]);



    useEffect(() => {
        if (!transformerRef.current) return;

        if (selectedIds.length) {
            const nodes = selectedIds
                .map(id => shapesRef.current.get(id))
                .filter(node => node);
            transformerRef.current.nodes(nodes);
        } else {
            transformerRef.current.nodes([]);
        }
    }, [selectedIds])

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            className="h-screen w-screen overflow-hidden bg-background"

            onMouseMove={(e) => {
                if (!stageRef.current || !awareness) return;

                awareness.setLocalStateField("cursor", stageRef.current.getRelativePointerPosition()!);
            }}

        >
            <Stage
                ref={stageRef}

                width={stageSize.width}
                height={stageSize.height}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePosition.x}
                y={stagePosition.y}

                draggable={stageDraggability}
                onDragMove={handleDragMove}

                onWheel={handleWheel}
                onClick={(e) => {
                    setContextMenuVisibility(false)

                    if (e.target === e.target.getStage()) {
                        setSelectedIds([]);
                    }
                }}
                

            >

                <Layer name="below-grid"></Layer>

                <InfiniteGrid />


                <Layer>
                    {
                        Object.entries(objects).map(([id, node]) => (
                            <BaseShape
                                key={id}
                                node={node}
                                id={id}
                                ref={(node) => {
                                    if (node) {
                                        shapesRef.current.set(id, node)
                                    }
                                }}
                            />
                        ))
                    }

                    <Transformer
                        keepRatio={false}
                        ref={transformerRef}
                        rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                        rotationSnapTolerance={5}
                        rotateAnchorOffset={30}
                        // anchorStyleFunc={(anchor) => {

                        // }}
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
                            if (!snapToGrid) return newPos;

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
                </Layer>

                <Layer name="drag" ref={dragLayerRef} />

                <Cursors />
            </Stage>

            <ContextMenu />
        </div>
    );
}
