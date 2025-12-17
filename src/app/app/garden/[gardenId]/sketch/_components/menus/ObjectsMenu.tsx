import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Search, Square, Circle, Hexagon, CircleDashed } from "lucide-react";
import { useState } from "react";
import { useGarden } from "@/lib/context/GardenContext";
import { ShapeType } from "@/lib/garden-canvas";
import * as Y from "yjs";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";

export default function ObjectsMenu({ className }: { className?: string }) {

    const [searchQuery, setSearchQuery] = useState("");
    const { ydoc, objectsMap } = useGarden();

    const addShape = (type: ShapeType) => {
        ydoc.transact(() => {
            const shape = new Y.Map();
            const id = nanoid();

            // Default props
            shape.set("pos", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
            shape.set("w", 100);
            shape.set("h", 100);
            shape.set("rotation", 0);
            shape.set("type", type);
            shape.set("fill", "#cccccc");
            shape.set("stroke", "black");
            shape.set("strokeWidth", 2);

            // Type specific defaults
            if (type === ShapeType.RegularPolygon) {
                shape.set("sides", 6);
            } else if (type === ShapeType.Ring) {
                shape.set("innerRadiusRatio", 0.5);
            }

            objectsMap.set(id, shape as any);
        });
    };

    const shapes = [
        { type: ShapeType.Rect, label: "Rectangle", icon: Square },
        { type: ShapeType.Ellipse, label: "Ellipse", icon: Circle },
        { type: ShapeType.RegularPolygon, label: "Polygon", icon: Hexagon },
        { type: ShapeType.Ring, label: "Ring", icon: CircleDashed },
    ];

    return (
        <div className={cn(" border flex flex-col", className)}>
            <ScrollArea>
                <div className="flex gap-4 p-3">
                    <InputGroup className="w-[350px]">
                        <InputGroupInput onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search furniture, shapes, etc..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        {/* <InputGroupAddon align="inline-end">{filteredPlantsCount} results</InputGroupAddon> */}
                    </InputGroup>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator />
            <ScrollArea className="min-h-[110px] flex-1">
                <div className="p-4">
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Geometric Shapes</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {shapes.map((shape) => (
                            <Button
                                key={shape.type}
                                variant="outline"
                                className="flex flex-col items-center h-auto py-4 gap-2"
                                onClick={() => addShape(shape.type)}
                            >
                                <shape.icon className="w-6 h-6" />
                                <span className="text-xs">{shape.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

        </div>
    );
}
