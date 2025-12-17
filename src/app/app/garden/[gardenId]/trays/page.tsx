"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import PlantsMenu from "../sketch/_components/menus/PlantsMenu";


/*

1. Ability to assign a seed variety to each cell or group of cells.
2. Ability to name tray
3. 

*/

const trays = [
    // {
    //     name: 'Tray 1',
    //     width: 8,
    //     height: 8,
    //     cells: [

    //     ]
    // },
    // {
    //     name: 'Tray 2',
    //     width: 10,
    //     height: 5,
    //     cells: [
    //     ]
    // }
]

export default function Page() {

    const [newTrayDialogOpen, setNewTrayDialogOpen] = useState(false);
    const [newTrayName, setNewTrayName] = useState("");
    const [newTrayWidth, setNewTrayWidth] = useState(0);
    const [newTrayHeight, setNewTrayHeight] = useState(0);

    const [selectedTrayIndex, setSelectedTrayIndex] = useState<number>(0);

    const addTray = () => {
        if (newTrayName && newTrayWidth > 0 && newTrayHeight > 0) {
            trays.push({
                name: newTrayName,
                width: newTrayWidth,
                height: newTrayHeight,
                cells: new Array(newTrayWidth * newTrayHeight).fill(0)
            });
            // Reset form
            setNewTrayName("");
            setNewTrayWidth(0);
            setNewTrayHeight(0);
            setNewTrayDialogOpen(false);
        }
    }

    return <>

        <div className="p-5 grid grid-cols-4 grid-rows-[1fr_auto]  gap-4 h-dvh">
            <Card className="col-span-1 row-span-2">
                <CardHeader>
                    <CardTitle>Seed Trays</CardTitle>
                    <CardAction>
                        <Dialog open={newTrayDialogOpen} onOpenChange={setNewTrayDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size={"sm"}>Add Tray</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className="text-center!">
                                    <DialogTitle>Add Seed Tray</DialogTitle>
                                    <DialogDescription>Create a new seed starting tray</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Tray Name</Label>
                                        <Input id="name" placeholder="e.g. Spring Seed Tray"
                                            onChange={(e) => setNewTrayName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-4 grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="width">Width (cells)</Label>
                                            <Input id="width" type="number" min={1} max={144} placeholder="e.g. 8"
                                                onChange={(e) => setNewTrayWidth(parseInt(e.target.value))} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="height">Height (cells)</Label>
                                            <Input id="height" type="number" min={1} max={144} placeholder="e.g. 8"
                                                onChange={(e) => setNewTrayHeight(parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                <Button className="mt-4 w-full" onClick={addTray}>Create Tray</Button>
                            </DialogContent>
                        </Dialog>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {trays.map((tray) => (
                        <Item key={tray.name} variant={"outline"} onClick={() => setSelectedTrayIndex(trays.indexOf(tray))} className="mb-2">
                            <ItemContent>
                                <ItemTitle>{tray.name}</ItemTitle>
                                <ItemDescription>{tray.width}&times;{tray.height} &bull; {tray.width * tray.height} cells</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                {/* <Button variant="ghost">Edit</Button> */}
                                <Button variant="ghost" className="text-red-600"><RiDeleteBin2Fill /></Button>
                            </ItemActions>
                        </Item>
                    ))}
                </CardContent>
            </Card>
            <Card className="col-span-3 h-full">

                <CardHeader>
                    <CardTitle>Tray Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* <div className="grid gap-1 w-1/2" style={{ gridTemplateColumns: `repeat(${width}, auto)` }}> */}
                    {/* {cells.map((_, i) => ( */}
                    {/* <div key={i} className="border-2 w-full aspect-square"></div> */}
                    {/* ))} */}
                    {/* </div> */}
                </CardContent>
            </Card>

            <PlantsMenu className="col-start-2 col-span-3 h-fit" />
        </div>


    </>;
}