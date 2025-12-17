import { Circle, Group } from "react-konva";

export default function BushShape() {
    return (
        <Group>
            <Circle x={0} y={0} radius={20} fill="#4E8B4A" />
            <Circle x={15} y={-15} radius={18} fill="#4E8B4A" />
            <Circle x={-15} y={-5} radius={18} fill="#4E8B4A" />
            <Circle x={0} y={15} radius={18} fill="#4E8B4A" />

        </Group>
    )
}