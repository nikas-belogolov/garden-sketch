'use client';

import { Activity, useState } from "react";
import { cn } from "@/lib/utils";
import PlantsMenu from "./menus/PlantsMenu";
import ObjectsMenu from "./menus/ObjectsMenu";
import PathsMenu from "./menus/PathsMenu";
import IrrigationMenu from "./menus/IrrigationMenu";
import { LuFlower2, LuArmchair } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type MenuType = 'plants' | 'objects' | 'paths' | 'irrigation';

export default function BottomMenu({ className }: { className?: string }) {
    const [activeMenu, setActiveMenu] = useState<MenuType>('plants');

    const menus = [
        { id: 'plants', label: 'Plants', icon: LuFlower2, component: PlantsMenu },
        { id: 'objects', label: 'Objects', icon: LuArmchair, component: ObjectsMenu },
        // { id: 'paths', label: 'Paths', icon: LuFootprints, component: PathsMenu },
        // { id: 'irrigation', label: 'Irrigation', icon: LuDroplets, component: IrrigationMenu },
    ] as const;

    return (
        <div className={"bg-sidebar border flex bottom-0 overflow-hidden shadow-xl fixed md:mx-auto md:left-0 md:right-0 md:w-9/12 lg:w-8/12 md:bottom-4 md:rounded-xl  w-dvw  h-[180px]"}>
            <div className="w-14 border-r flex flex-col items-center py-2 gap-2 bg-muted/30 shrink-0">
                <TooltipProvider delayDuration={0}>
                    {/* <ScrollArea> */}
                        {menus.map((menu) => (
                            <Tooltip key={menu.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={activeMenu === menu.id ? "secondary" : "ghost"}
                                        size="icon"
                                        onClick={() => setActiveMenu(menu.id)}
                                        className={cn("h-10 w-10", activeMenu === menu.id && "bg-background shadow-sm")}
                                    >
                                        <menu.icon size={20} />
                                        <span className="sr-only">{menu.label}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p>{menu.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    {/* </ScrollArea> */}

                </TooltipProvider>
            </div>
            <div className="flex-1 min-w-0 relative">
                {menus.map(menu => {
                    return (
                        <menu.component
                            key={menu.id}
                            className={cn(activeMenu === menu.id ? "block" : "hidden", "border-0 shadow-none h-full w-full rounded-none")}
                        />
                    )
                })}
            </div>
        </div>
    );
}
