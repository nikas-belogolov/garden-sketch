import { useGarden } from "@/lib/context/GardenContext";
import { contextMenuIsVisibleAtom, contextMenuPositionAtom, currentShapeBoundBoxAtom, selectedIdsAtom, Shape, shapeAtomFamily, ShapeType } from "@/lib/garden-canvas";
import { useAtom, useSetAtom } from "jotai";
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Label, Tag, Text } from "react-konva";
import { Portal } from "react-konva-utils";
import { TypedMap } from "yjs-types";
import PlantShape from "./PlantShape";

interface BaseShapeProps extends Konva.NodeConfig {
    node: Shape,
    id: string,
}

const BaseShape = React.memo(({ node, id }: BaseShapeProps) => {
    const innerRef = useRef<Konva.Shape>(null)

    const setShape = useSetAtom(shapeAtomFamily(id))

    useEffect(() => {
        setShape(innerRef.current)
    }, [innerRef.current])

    const { undoManager } = useGarden()

    const labelRef = useRef<Konva.Label>(null);
    const [labelVisible, setLabelVisible] = useState(false);

    const [labelText, setLabelText] = useState<string>()

    /* Context Menu */
    const setContextMenuPosition = useSetAtom(contextMenuPositionAtom)
    const setContextMenuVisibility = useSetAtom(contextMenuIsVisibleAtom)

    const setCurrentShapeBoundBox = useSetAtom(currentShapeBoundBoxAtom);

    const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
    const { ydoc } = useGarden()
    const nodeMap = useRef(ydoc.getMap("objects").get(id) as TypedMap<BaseShapeProps>)

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

    // useEffect(() => {
    //     console.log(node.rotation)
    // }, [node.rotation])

    function handleClick() {
        // For now, just select the clicked item (single selection)
        // Multi-selection is handled in Canvas.tsx with meta keys
        setSelectedIds([id]);

        if (node.type == ShapeType.Plant) {
            setCurrentShapeBoundBox({
                width: node.plantSpacing,
                height: node.rowSpacing,
            })
        }
        console.log(selectedIds)
    }

    const handleDrag = () => {
        nodeMap.current.set("pos", innerRef.current?.getPosition())
    }

    const handleDragEnd = () => {
        nodeMap.current.set("pos", innerRef.current?.getPosition());
        undoManager.stopCapturing()
    }

    function handleTransform(e: Konva.KonvaEventObject<Event>) {
        if (!innerRef.current) return;
        const node = innerRef.current;

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

    }

    function handleTransformEnd(e: Konva.KonvaEventObject<Event>) {

        if (!innerRef.current) return;
        const node = innerRef.current;

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
        onMouseOut: () => setLabelVisible(false),


        onPointerClick: handleClick,

        onDragMove: handleDrag,
        onDragEnd: handleDragEnd,

        onTransformStart: (e: Konva.KonvaEventObject<Event>) => e.target.clearCache(),
        onTransform: handleTransform,
        onTransformEnd: handleTransformEnd,

        ref: innerRef,
    };

    // Render the appropriate shape component based on type
    const renderShape = () => {


        switch (node.type) {
            case ShapeType.Plant:
                return (
                    <PlantShape
                        {...commonProps}
                        node={node}
                        setLabelText={setLabelText}

                    />
                );
            // case ShapeType.Rect:
            // case ShapeType.Ellipse:
            // case ShapeType.Ring:
            // case ShapeType.RegularPolygon:
            //     return <GeometricShape {...commonProps} node={node as GeometricShapeProps} />;
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

            <Portal selector=".top">
                <Label
                    opacity={labelVisible ? 1 : 0}
                    key={node.id + "label"}
                    rotation={node.rotation}
                    ref={labelRef}

                    x={node.pos.x - node.h * Math.sin((node.rotation * Math.PI) / 180)}
                    y={node.pos.y + node.h * Math.cos((node.rotation * Math.PI) / 180) + 10}
                >
                    <Tag fill="oklch(0.50 0.14 145)" opacity={0.5} cornerRadius={4} />
                    <Text
                        width={node.w}
                        padding={4}
                        align="center"
                        text={labelText}
                        fill={"#fff"}
                        fontSize={14}
                        fontStyle="bold"
                    />
                </Label>
            </Portal>

        </>
    )
})

export default BaseShape;