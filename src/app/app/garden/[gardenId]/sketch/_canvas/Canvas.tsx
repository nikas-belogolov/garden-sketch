'use client';

import { contextMenuIsVisibleAtom, currentDraggedObject, measurementUnitAtom, selectedIdsAtom, shapeAtomFamily, stageDraggabilityAtom, stagePosititionAtom, stageScaleAtom, stageSizeAtom, toPixels } from "@/lib/garden-canvas";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { DragEventHandler, useCallback, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import InfiniteGrid from "./InfiniteGrid";

import { useGarden } from "@/lib/context/GardenContext";
import { MAX_SCALE, MIN_SCALE, snapToGridAtom } from "@/lib/garden-canvas";
import Konva from "konva";

import { useAuth } from "@/lib/context/AuthContext";
import { nanoid } from 'nanoid';
import { useY } from "react-yjs";
import * as Y from "yjs";
import { ContextMenu } from "../_components/ContextMenu";
import Cursors from "./Cursors";
import BaseShape from "./shapes/BaseShape";
import ShapeTransformer from "./Transformer";

export default function Canvas() {
    const { user } = useAuth()
    const { ydoc, objectsMap, undoManager, awareness } = useGarden()

    /* STAGE */
    const [stagePosition, setStagePosition] = useAtom(stagePosititionAtom)
    const [stageSize, setStageSize] = useAtom(stageSizeAtom);
    const [stageScale, setStageScale] = useAtom(stageScaleAtom);
    const stageDraggability = useAtomValue(stageDraggabilityAtom)
    const stageRef = useRef<Konva.Stage>(null);


    /* LOCAL PREFERENCES */
    const [snapToGrid, setSnapToGrid] = useAtom(snapToGridAtom)
    const measurementUnit = useAtomValue(measurementUnitAtom)

    // const shapesRef = useRef(new Map())
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
                shape.set("rotation", 0)

                if (currentDraggedObjectValue.type === "plant") {
                    shape.set("img", currentDraggedObjectValue.image)
                    shape.set("commonName", currentDraggedObjectValue.name)
                    shape.set("rowSpacing", toPixels(currentDraggedObjectValue.planting.spacing.metric, measurementUnit));
                    shape.set("plantSpacing", toPixels(currentDraggedObjectValue.planting.spacing.metric, measurementUnit));
                    shape.set("type", "plant")
                }

                objectsMap.set(nanoid(), shape as any)
            })
        }
    }

    const objects = useY(objectsMap)
    // const transformerRef = useRef<Konva.Transformer>(null);
    // Clean up shapesRef when objects are deleted
    useEffect(() => {
        const currentIds = new Set(Object.keys(objects));
        // const refIds = Array.from(shapeAtomFamily.keys());

        // Remove refs for deleted objects
        for (const id of shapeAtomFamily.getParams()) {
            if (!currentIds.has(id)) {
                shapeAtomFamily.remove(id);
            }
        }
    }, [objects]);



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
                            // ref={(node) => {
                            // if (node) {
                            //     const setShape = useSetAtom(shapeAtomFamily(id))
                            //     setShape(node)
                            // }
                            // }}
                            />
                        ))
                    }

                    <ShapeTransformer />
                </Layer>

                <Layer listening={false} name="top">
                    <Cursors />
                </Layer>

            </Stage>

            <ContextMenu />
        </div>
    );
}
