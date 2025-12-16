'use client';

import { useAtom, useAtomValue } from "jotai";
import { selectedIdsAtom } from "@/lib/stores/gardenLayoutAtoms";
import { useGarden } from "@/lib/context/GardenContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { X, Trash2, Copy, Sun, Droplets, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as Y from "yjs";

import { nanoid } from "nanoid";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { isInfoPanelOpenAtom } from "../../../common";

export default function InfoPanel() {
    const selectedIds = useAtomValue(selectedIdsAtom);
    const { objectsMap, ydoc } = useGarden();
    const [isExpanded, setIsExpanded] = useState(true);

    // Get the first selected plant's data
    const selectedPlant = selectedIds.length > 0
        ? objectsMap.get(selectedIds[0])
        : null;

    const plantData = selectedPlant ? {
        id: selectedIds[0],
        commonName: (selectedPlant as unknown as Y.Map<any>).get('commonName'),
        img: (selectedPlant as unknown as Y.Map<any>).get('img'),
        rowSpacing: (selectedPlant as unknown as Y.Map<any>).get('rowSpacing'),
        plantSpacing: (selectedPlant as unknown as Y.Map<any>).get('plantSpacing'),
        pos: (selectedPlant as unknown as Y.Map<any>).get('pos'),
        w: (selectedPlant as unknown as Y.Map<any>).get('w'),
        h: (selectedPlant as unknown as Y.Map<any>).get('h'),
    } : null;

    const handleDelete = () => {
        ydoc.transact(() => {
            selectedIds.forEach(id => {
                objectsMap.delete(id);
            });
        });
    };

    const handleDuplicate = () => {
        if (!selectedPlant) return;

        ydoc.transact(() => {
            const newPlant = new Y.Map();
            (selectedPlant as unknown as Y.Map<any>).forEach((value: any, key: string) => {
                if (key === 'pos') {
                    newPlant.set(key, {
                        x: value.x + 50,
                        y: value.y + 50
                    });
                } else {
                    newPlant.set(key, value);
                }
            });

            objectsMap.set(nanoid(), newPlant as any);
        });
    };

    // if (selectedIds.length === 0) {
    //     return null;
    // }

    const [isInfoPanelOpen, setIsInfoPanelOpen] = useAtom(isInfoPanelOpenAtom)

    useEffect(() => {
        if (selectedIds.length === 0) {
            setIsInfoPanelOpen(false)
        } else {
            setIsInfoPanelOpen(true)
        }
    }, [selectedIds])

    return (
        <Sheet open={isInfoPanelOpen} onOpenChange={(isOpen: boolean) => setIsInfoPanelOpen(isOpen)}>
            {/* <SheetTrigger>Open</SheetTrigger> */}
            <SheetContent className="sm:w-screen">
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
        // <div className={cn(
        //     "fixed right-4 top-20 z-50 transition-all duration-300",
        //     isExpanded ? "w-80" : "w-12"
        // )}>
        //     <Card className="shadow-lg border-2">
        //         <CardHeader className="pb-3">
        //             <div className="flex items-start justify-between">
        //                 <div className="flex-1">
        //                     <CardTitle className="text-lg flex items-center gap-2">
        //                         <Info className="w-5 h-5" />
        //                         {isExpanded && (selectedIds.length === 1 ? "Plant Details" : `${selectedIds.length} Plants Selected`)}
        //                     </CardTitle>
        //                     {isExpanded && plantData && (
        //                         <CardDescription className="mt-1">
        //                             {plantData.commonName}
        //                         </CardDescription>
        //                     )}
        //                 </div>
        //                 <Button
        //                     variant="ghost"
        //                     size="icon"
        //                     className="h-6 w-6 -mt-1"
        //                     onClick={() => setIsExpanded(!isExpanded)}
        //                 >
        //                     {isExpanded ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        //                 </Button>
        //             </div>
        //         </CardHeader>

        //         {isExpanded && (
        //             <CardContent className="space-y-4">
        //                 {plantData && selectedIds.length === 1 && (
        //                     <>
        //                         {/* Plant Image */}
        //                         {plantData.img && (
        //                             <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
        //                                 <Image
        //                                     src={`/illustrations/${plantData.img}`}
        //                                     alt={plantData.commonName}
        //                                     fill
        //                                     className="object-contain p-4"
        //                                 />
        //                             </div>
        //                         )}

        //                         <Separator />

        //                         {/* Plant Information */}
        //                         <div className="space-y-3">
        //                             <div>
        //                                 <Label className="text-xs text-muted-foreground">Common Name</Label>
        //                                 <p className="font-medium">{plantData.commonName}</p>
        //                             </div>

        //                             <div className="grid grid-cols-2 gap-3">
        //                                 <div>
        //                                     <Label className="text-xs text-muted-foreground">Row Spacing</Label>
        //                                     <p className="font-medium">{plantData.rowSpacing} cm</p>
        //                                 </div>
        //                                 <div>
        //                                     <Label className="text-xs text-muted-foreground">Plant Spacing</Label>
        //                                     <p className="font-medium">{plantData.plantSpacing} cm</p>
        //                                 </div>
        //                             </div>
        //                         </div>

        //                         <Separator />
        //                     </>
        //                 )}

        //                 {/* Multi-selection info */}
        //                 {selectedIds.length > 1 && (
        //                     <div className="text-sm text-muted-foreground">
        //                         <p>{selectedIds.length} plants selected</p>
        //                         <p className="text-xs mt-1">Bulk actions available below</p>
        //                     </div>
        //                 )}

        //                 {/* Actions */}
        //                 <div className="flex gap-2">
        //                     <Button
        //                         variant="outline"
        //                         size="sm"
        //                         className="flex-1"
        //                         onClick={handleDuplicate}
        //                         disabled={selectedIds.length !== 1}
        //                     >
        //                         <Copy className="w-4 h-4 mr-1" />
        //                         Duplicate
        //                     </Button>
        //                     <Button
        //                         variant="destructive"
        //                         size="sm"
        //                         className="flex-1"
        //                         onClick={handleDelete}
        //                     >
        //                         <Trash2 className="w-4 h-4 mr-1" />
        //                         Delete
        //                     </Button>
        //                 </div>

        //             </CardContent>
        //         )}
        //     </Card>
        // </div>
    );
}
