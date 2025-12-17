import { atom, useAtomValue } from "jotai";
import { atomFamily } from 'jotai-family';
import Konva from "konva";

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

export const clamp = (val: number, min: number, max: number) => Math.max(Math.min(val, max), min);

// export const MAX_WORLD = 5000; // In pixels
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 2;

export enum MeasurementUnit {
    Metric = "m",
    Imperial = "′"
}

export const PIXELS_PER_METER = 100;
export const PIXELS_PER_FOOT = 32.8;

export const metricToPixels = (num: number) => num * PIXELS_PER_METER
export const imperialToPixels = (num: number) => num * PIXELS_PER_FOOT

export const toPixels = (num: number, unit: MeasurementUnit) => {
    if (unit === MeasurementUnit.Metric) {
        return metricToPixels(num / 100);
    }
    return imperialToPixels(num / 12);
}

export const perUnitStyles = {
    [MeasurementUnit.Metric]: [
        {
            spacing: PIXELS_PER_METER,
            lineWidth: 0.5,
            tickLength: 12
        },
        {
            spacing: PIXELS_PER_METER / 2,
            lineWidth: 0.25,
            tickLength: 7
        }
    ],
    [MeasurementUnit.Imperial]: [
        {
            spacing: PIXELS_PER_FOOT,
            lineWidth: 0.5,
            tickLength: 12
        },
        {
            spacing: PIXELS_PER_FOOT / 2,
            lineWidth: 0.25,
            tickLength: 7
        }
    ]
}

enum Sunlight {
    FullSun = "full-sun",
    PartialSun = "partial-sun",
    FullShade = "full-shade"
}

const sunlightToNum = {
    [Sunlight.FullSun]: 1,
    [Sunlight.PartialSun]: 0.5,
    [Sunlight.FullShade]: 0
}

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export enum ShapeType {
    Rect = "rect",
    Ellipse = "ellipse",
    Ring = "ring",
    RegularPolygon = "regularPolygon",
    Structure = "structure",
    Text = "text",
    Layer = "layer",
    Plant = "plant"
}

export interface BaseShapeProps {
    id: string;
    pos: {
        x: number;
        y: number;
    };
    w: number;
    h: number;
    rotation: number;
}

export interface PlantShapeProps extends BaseShapeProps {
    type: ShapeType.Plant;
    name: string;
    species: string;
    image: string;
    category: string;

    // Plant Data
    germination?: {
        min: number;
        max: number;
    };
    hardinessZone?: {
        min: number;
        max: number;
    };
    harvest?: {
        min: number;
        max: number;
        unit: string;
    };
    planting: {
        depth?: {
            metric: number;
            imperial: number;
        };
        spacing: {
            metric: number;
            imperial: number;
        };
    };
    sun: {
        min: string;
        max: string;
    };
    yield?: {
        amount: number;
        unit: string;
    };
    soilImpact?: string;
    nutrients?: {
        calories: number;
        carbohydrates: number;
        protein: number;
        fat: number;
    };
    goodCompanions: string[];
    badCompanions: string[];

    // Canvas Specific
    rowSpacing: number;
    plantSpacing: number;
}

interface CommonGeometricProps {
    fill: string;
    stroke: string;
    strokeWidth: number;
}

export interface RectShapeProps extends BaseShapeProps, CommonGeometricProps {
    type: ShapeType.Rect;
}

export interface EllipseShapeProps extends BaseShapeProps, CommonGeometricProps {
    type: ShapeType.Ellipse;
}

export interface RingShapeProps extends BaseShapeProps, CommonGeometricProps {
    type: ShapeType.Ring;
    innerRadius?: number;
    innerRadiusRatio?: number;
    outerRadius?: number;
}

export interface RegularPolygonShapeProps extends BaseShapeProps, CommonGeometricProps {
    type: ShapeType.RegularPolygon;
    sides?: number;
}

export type GeometricShapeProps =
    | RectShapeProps
    | EllipseShapeProps
    | RingShapeProps
    | RegularPolygonShapeProps;

export interface StructureShapeProps extends BaseShapeProps {
    type: ShapeType.Structure;
    // Add any specific properties for Structure here if needed
}

export interface TextShapeProps extends BaseShapeProps {
    type: ShapeType.Text;
    text: string;
    fontSize: number;
    color: string;
}

export interface LayerShapeProps extends BaseShapeProps {
    type: ShapeType.Layer;
    // Add any specific properties for Layer here if needed
}



export type Shape =
    | PlantShapeProps
    | RectShapeProps
    | EllipseShapeProps
    | RingShapeProps
    | RegularPolygonShapeProps
    | StructureShapeProps
    | TextShapeProps
    | LayerShapeProps;

export type ActionType =
    | "writing"
    | "drawing"
    | "moving"
    | "panning"
    | "resizing"
    | "none";

/* -------------------------------------------------------------------------- */
/*                                    ATOMS                                   */
/* -------------------------------------------------------------------------- */

/* Locale */
export const measurementUnitAtom = atom(MeasurementUnit.Metric);
export const snapToGridAtom = atom(false)

/* Menus */
export const isInfoPanelOpenAtom = atom(false)

/* Canvas State */
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

export const nodeAtomFamily = atomFamily((id: string) => atom<Shape | null>(null))
export const shapeAtomFamily = atomFamily((id: string) => atom<Konva.Node | null>(null))

export const selectedIdsAtom = atom<string[]>([])
export const selectedShapesAtom = atom((get) => {
    const selectedIds = get(selectedIdsAtom);
    return selectedIds.map(id => get(shapeAtomFamily(id))).filter(node => node !== null);
});

// export const selectedElementAtom = atom<ElementType | null>(null);

export const contextMenuPositionAtom = atom({ x: 0, y: 0 });
export const contextMenuIsVisibleAtom = atom(false)

export const currentShapeBoundBoxAtom = atom<{ width: number, height: number } | null>(null);
