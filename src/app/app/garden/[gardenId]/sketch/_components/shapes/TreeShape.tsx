import { Circle, Group, Shape } from "react-konva";
import { PlantElementType } from "../../../common";
import Konva from "konva";
import { useImage } from "react-konva-utils";

interface PlantShapeProps extends Konva.ShapeConfig {
    node: PlantElementType
}

export default function TreeShape({ node }: PlantShapeProps) {

    const [image, state] = useImage(`/illustrations/${node.img}`, "anonymous")


    return (
        <Group>
            <Circle
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                fill="#228B22"
            />
            
        </Group>
            
    )
}