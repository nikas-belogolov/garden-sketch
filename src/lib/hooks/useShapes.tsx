import { useEffect, useState } from "react";
import { yObjects } from "../stores/y";

import * as Y from "yjs"
import { TypedMap } from "yjs-types";
import { ShapeProps } from "@/app/app/garden/[gardenId]/common";
import { nanoid } from "nanoid";
import { useGarden } from "../context/GardenContext";

export default function useShapes() {
    const { doc } = useGarden();

    const [shapes, setShapes] = useState<TypedMap<ShapeProps>>()

    useEffect(() => {

        function handleChange() {
            setShapes(yObjects);
        }

        yObjects.observe(handleChange);

        return () => {
            yObjects.unobserve(handleChange);
        }
    })


    return { shapes };
}