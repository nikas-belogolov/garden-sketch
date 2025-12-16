import Konva from "konva";
import { Group, KonvaNodeEvents, Label, Shape, Tag } from "react-konva";
import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { useImage } from "react-konva-utils";
import { metricToPixels, PlantShapeProps } from "../../../common";
import { useGarden } from "@/lib/context/GardenContext";

interface PlantShapeComponentProps extends Konva.ShapeConfig, KonvaNodeEvents {
    node: PlantShapeProps,
    setLabelText: (label: string) => void,
    // id: string,
    ref: Ref<Konva.Shape>,

}

export default function PlantShape({
    node, setLabelText, ref, ...props
}: PlantShapeComponentProps) {

    const [image, state] = useImage(`/illustrations/${node.img}`, "anonymous")
    const bufferRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    useEffect(() => {
        if (!image) return;
        const buf = bufferRef.current;
        buf.width = 100
        buf.height = 100;
        buf.getContext('2d')?.drawImage(image, 0, 0, image.width, image.height, 0, 0, 100, 100);
    }, [image]);

    const ICON_SIZE = node.plantSpacing * 1.5;

    const sceneFunc = (ctx: Konva.Context, shape: Konva.Shape) => {
        const buf = bufferRef.current;
        if (!buf) return;

        const scale = shape.scale()!;
        const width = shape.width() * scale.x;
        const height = shape.height() * scale.y;

        ctx.save();
        ctx.scale(1 / scale.x, 1 / scale.y);

        let cols = Math.max(1, Math.floor(width / node.plantSpacing));
        let rows = Math.max(1, Math.floor(height / node.rowSpacing));

        let plantSpacing = width / cols;
        let rowSpacing = height / rows;

        const offsetX = (plantSpacing - ICON_SIZE) / 2;
        const offsetY = (rowSpacing - ICON_SIZE) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * plantSpacing + offsetX;
                const y = row * rowSpacing + offsetY;
                ctx.drawImage(buf, x, y, ICON_SIZE, ICON_SIZE)
            }
        }

        ctx.restore();
        ctx.fillStrokeShape(shape)
    };

    useEffect(() => {
        const plantsInRow = Math.max(1, Math.floor(node.w / node.plantSpacing));
        const plantsInColumn = Math.max(1, Math.floor(node.h / node.rowSpacing));
        setLabelText(`${node.commonName} ${plantsInRow}x${plantsInColumn}`)
    }, [node.commonName, node.plantSpacing, node.rowSpacing, node.w, node.h]);

    const hitFunc = (ctx: Konva.Context, shape: Konva.Shape) => {
        ctx.beginPath();
        ctx.rect(0, 0, shape.width(), shape.height());
        ctx.closePath();
        ctx.fillStrokeShape(shape);
    };

    return (
        <Shape

            width={node.w}
            height={node.h}

            sceneFunc={sceneFunc}
            hitFunc={hitFunc}

            ref={ref}
            {...props}
            
            perfectDrawEnabled={false}

        />
    )
}