import { atom } from "jotai";

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



/* Canvas */

export enum ShapeType {
    Plant = "plant",

    // Geometric Shapes
    Rect = "rect",
    Ellipse = "ellipse",
    Ring = "ring",
    RegularPolygon = "regular_polygon",

    Structure = "structure",
    Text = "text",
    Layer = "layer"
}

export type ShapeProps = {
    id: string;
    pos: {
        x: number;
        y: number;
    };
    w: number;
    h: number;
    type: ShapeType;
    rotation: number;
}

export type PlantShapeProps = ShapeProps & {
    commonName: string;
    scientificName: string;
    goodCompanions: string[];
    category: string;
    sunlightRequirements: string[];
    img: string;
    rowSpacing: number;
    plantSpacing: number;
}

export type GeometricShapeProps = ShapeProps & {
    fill: string;
    stroke: string;
    strokeWidth: number;

    // Specifics
    innerRadius?: number; // for Ring
    innerRadiusRatio?: number; // for Ring (relative to outerRadius/width)
    outerRadius?: number; // for Ring
    sides?: number; // for RegularPolygon
};

export type TextShapeProps = ShapeProps & {
    text: string;
    fontSize: number;
    color: string;
}

/* Locale */
export const measurementUnitAtom = atom(MeasurementUnit.Metric);
export const snapToGridAtom = atom(false)

/* Menus */
export const isInfoPanelOpenAtom = atom(false)