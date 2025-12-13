import React from 'react';
import { Circle, Rect, Ellipse, Wedge, Line, Star, Ring, Arc, RegularPolygon, Arrow } from 'react-konva';
import { GeometricShapeProps, ShapeType } from '../../../common';
import Konva from 'konva';

interface Props {
    node: GeometricShapeProps;
    [key: string]: any; // for commonProps
}

const GeometricShape: React.FC<Props> = ({ node, ref, ...props }) => {


    const shapeProps = {
        ...props,
        fill: node.fill || '#cccccc',
        stroke: node.stroke || 'black',
        strokeWidth: node.strokeWidth || 2,
        width: node.w,
        height: node.h,
        ref,
        perfectDrawEnabled: false,
    };

    const radius = node.w / 2;
    // Use innerRadiusRatio if available, otherwise fallback to innerRadius or default 0.5 * radius
    const innerRadius = node.innerRadiusRatio
        ? radius * node.innerRadiusRatio
        : (node.innerRadius || radius * 0.5);



    switch (node.type) {
        case ShapeType.Rect:
            return <Rect {...shapeProps} cornerRadius={5} />;
        case ShapeType.Ellipse:
            return <Ellipse {...shapeProps} radiusX={node.w / 2} radiusY={node.h / 2} />;
        case ShapeType.Ring:
            return <Ring {...shapeProps} innerRadius={innerRadius} outerRadius={radius} />;
        case ShapeType.RegularPolygon:
            return <RegularPolygon {...shapeProps} sides={node.sides || 6} radius={radius} />;
        default:
            return null;
    }
};

export default GeometricShape;
