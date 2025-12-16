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
    commonName: string;
    scientificName: string;
    goodCompanions: string[];
    category: string;
    sunlightRequirements: string[];
    img: string;
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

/* Locale */
export const measurementUnitAtom = atom(MeasurementUnit.Metric);
export const snapToGridAtom = atom(false)

/* Menus */
export const isInfoPanelOpenAtom = atom(false)