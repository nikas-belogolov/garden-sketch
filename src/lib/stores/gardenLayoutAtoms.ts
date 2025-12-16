import { PlantShapeProps, Shape, TextShapeProps } from "@/app/app/garden/[gardenId]/common";
import { atom } from "jotai";
import Konva from "konva";

export type ActionType =
    | "writing"
    | "drawing"
    | "moving"
    | "panning"
    | "resizing"
    | "none";

export const actionAtom = atom<ActionType>("none");

/* KONVA STAGE */
export const stagePosititionAtom = atom({ x: 0, y: 0 })
export const stageSizeAtom = atom({ width: 1, height: 1 });
export const stageScaleAtom = atom(1);
export const stageDraggabilityAtom = atom(get => {
    const action = get(actionAtom);

    if (action == "drawing") return false;

    return true;
})

export const currentDraggedObject = atom<Shape | null>()

// Konva.Shape map for transformations
export const shapesAtom = atom(new Map())
export const selectedIdsAtom = atom<string[]>([])

// export const selectedElementAtom = atom<ElementType | null>(null);

export const contextMenuPositionAtom = atom({ x: 0, y: 0 });
export const contextMenuIsVisibleAtom = atom(false)

export const currentShapeBoundBoxAtom = atom<{ width: number, height: number } | null>(null);