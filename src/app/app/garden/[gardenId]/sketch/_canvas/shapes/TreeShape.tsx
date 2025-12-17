import { PlantShapeProps } from "@/lib/garden-canvas";
import Konva from "konva";
import { Circle, Group, KonvaNodeEvents } from "react-konva";
import { useImage } from "react-konva-utils";

interface PlantShapeComponentProps extends Konva.ShapeConfig, KonvaNodeEvents {
    node: PlantShapeProps
}

export default function TreeShape({ node, ...props }: PlantShapeComponentProps) {

    const [image, state] = useImage(`/illustrations/${node.img}`, "anonymous")

    return (
        <Group>
            <Circle
                x={node.pos.x}
                y={node.pos.y}
                width={node.w}
                height={node.h}
                fill="#228B22"
            />

        </Group>

    )
}