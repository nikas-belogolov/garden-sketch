import { Group, Label, Tag, Text } from "react-konva";
import { PlantShapeProps, ShapeProps, ShapeType, GeometricShapeProps } from "../../../common";
import PlantShape from "./PlantShape";
import GeometricShape from "./GeometricShape";
import React, { forwardRef, Ref, startTransition, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import Konva from "konva";
import { useAtom, useSetAtom } from "jotai";
import { selectedIdsAtom, shapesAtom, contextMenuIsVisibleAtom, contextMenuPositionAtom, currentShapeBoundBoxAtom } from "@/lib/stores/gardenLayoutAtoms";
import { Portal } from "react-konva-utils";
import { useGarden } from "@/lib/stores/GardenContext";

import { throttle } from "@tanstack/pacer"

import * as Y from "yjs"

// export const BaseShape = forwardRef
import { TypedMap } from "yjs-types";
import { useY } from "react-yjs";

interface BaseShapeProps extends Konva.NodeConfig {
    node: ShapeProps,
    id: string,
    ref: Ref<Konva.Shape>
}

const BaseShape = React.memo(({ node, id, ref }: BaseShapeProps) => {
    const innerRef = useRef<Konva.Shape>(null)

    useImperativeHandle(ref, () => innerRef.current!)

    const { undoManager } = useGarden()

    const labelRef = useRef<Konva.Label>(null);
    const [labelVisible, setLabelVisible] = useState(false);

    const [labelText, setLabelText] = useState<string>()
    const [labelX, setLabelX] = useState(0)

    /* Context Menu */
    const setContextMenuPosition = useSetAtom(contextMenuPositionAtom)
    const setContextMenuVisibility = useSetAtom(contextMenuIsVisibleAtom)

    const setCurrentShapeBoundBox = useSetAtom(currentShapeBoundBoxAtom);

    const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
    const { ydoc } = useGarden()
    const nodeMap = useRef(ydoc.getMap("objects").get(id) as TypedMap<ShapeProps>)

    const handleContextMenu = (e: Konva.KonvaEventObject<Event>) => {
        e.evt.preventDefault()

        const shapePos = e.target.getAbsolutePosition()
        const pointerPos = e.target.getRelativePointerPosition()!

        setContextMenuPosition({
            x: shapePos.x + pointerPos.x + 4,
            y: shapePos.y + pointerPos.y + 4
        });

        setContextMenuVisibility(true);
    }

    function handleClick() {
        // For now, just select the clicked item (single selection)
        // Multi-selection is handled in Canvas.tsx with meta keys
        setSelectedIds([id]);

        if (node.type == ShapeType.Plant) {
            setCurrentShapeBoundBox({
                width: (node as PlantShapeProps).plantSpacing,
                height: (node as PlantShapeProps).rowSpacing,
            })
        }
        console.log(selectedIds)
    }

    function handleDrag() {
        if (!innerRef.current) return;
        nodeMap.current.set("pos", innerRef.current?.getPosition())
    }

    const handleDragEnd = () => undoManager.stopCapturing()

    function handleTransformEnd(e: Konva.KonvaEventObject<Event>) {

        if (!innerRef.current) return;
        const node = innerRef.current;

        // const group = groupRef.current;

        ydoc.transact(() => {

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;

            nodeMap.current.set("w", newWidth);
            nodeMap.current.set("h", newHeight);
            nodeMap.current.set("rotation", node.rotation());

            nodeMap.current.set("pos", node.getPosition());
            node.scale({ x: 1, y: 1 });
        })

        undoManager.stopCapturing()
    }

    // Common props for all shape types
    const commonProps = {
        id,
        x: node.pos.x,
        y: node.pos.y,
        rotation: node.rotation,
        draggable: true,

        onContextMenu: handleContextMenu,
        onMouseOver: () => setLabelVisible(true),
        onMouseLeave: () => setLabelVisible(false),

        onPointerClick: handleClick,

        onDragMove: handleDrag,
        onDragEnd: handleDragEnd,
        onTransformEnd: handleTransformEnd,
        onTransformStart: (e: Konva.KonvaEventObject<Event>) => e.target.clearCache(),

        ref: innerRef,
    };

    // Render the appropriate shape component based on type
    const renderShape = () => {
        switch (node.type) {
            case "plant":
                return (
                    <PlantShape
                        {...commonProps}
                        node={node as PlantShapeProps}
                        setLabelText={setLabelText}

                    />
                );
            case ShapeType.Rect:
            case ShapeType.Ellipse:
            case ShapeType.Ring:
            case ShapeType.RegularPolygon:
                return <GeometricShape {...commonProps} node={node as GeometricShapeProps} />;
            // Add more shape types here as needed
            // case "rectangle":
            //     return <RectangleShape {...commonProps} node={node as RectangleShapeProps} />;
            default:
                return null;
        }
    };

    return (
        <>
            {renderShape()}

            {/* <Portal selector=".top"> */}
            {<>
                {/* <Label key={node.id + "label"}  ref={labelRef} x={labelX} y={node.h} opacity={0.75}> */}
                {/* <Tag fill="green" /> */}
                {/* <Text
                            y={node.h}
                            // x={0}
                            width={node.w}
                            padding={3}
                            align="center"
                            text={labelText}
                            fill={"#000"}
                            fontSize={16}
                        /> */}
                {/* </Label> */}
            </>}
            {/* </Portal> */}
        </>
    )
})

export default BaseShape;