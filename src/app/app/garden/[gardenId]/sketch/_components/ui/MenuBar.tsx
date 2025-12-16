'use client';

import { useAtom } from "jotai";
import { MeasurementUnit, measurementUnitAtom, snapToGridAtom } from "@/app/app/garden/[gardenId]/common";
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { useGarden } from "@/lib/context/GardenContext";
import { Input } from "@/components/ui/input";
import { useY } from "react-yjs";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function MenuBar() {
    // return (
    //     <div className="absolute top-4 left-4 w-1/2 bg-primary-foreground">
    //         MenuBar
    //     </div>
    // )

    // const { name: gardenName } = useGarden();

    const { ydoc, undoManager } = useGarden()

    const name = useY(ydoc.getText("name"))

    const [measurementUnit, setMeasurementUnit] = useAtom(measurementUnitAtom);
    const [snapToGrid, setSnapToGrid] = useAtom(snapToGridAtom)
    const router = useRouter();

    async function handleSignout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/login"); // redirect to login page
                },
            },
        });
    }

    return (
        <div className="absolute top-0 md:top-4 left-0 right-0 w-full flex justify-center">
            <Menubar className="bg-card w-dvw md:w-11/12 h-12 rounded-none md:rounded-md">
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            Export
                        </MenubarItem>
                        <MenubarItem>
                            Print
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <MenubarItem onClick={() => undoManager.undo()}>
                                Undo
                                <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={() => undoManager.redo()}>
                                Redo
                                <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                            </MenubarItem>
                        </MenubarGroup>
                        <MenubarSeparator />
                        <MenubarGroup>
                            <MenubarItem>Cut</MenubarItem>
                            <MenubarItem>Copy</MenubarItem>
                            <MenubarItem>Paste</MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value={measurementUnit} onValueChange={(unit: string) => setMeasurementUnit(unit as MeasurementUnit)}>
                            <MenubarLabel>Measurement Units</MenubarLabel>
                            <MenubarRadioItem value={MeasurementUnit.Metric}>
                                Metric
                            </MenubarRadioItem>
                            <MenubarRadioItem value={MeasurementUnit.Imperial} >
                                Imerial
                            </MenubarRadioItem>
                        </MenubarRadioGroup>
                        <MenubarSeparator />
                        <MenubarCheckboxItem checked={snapToGrid} onCheckedChange={(checked: boolean) => setSnapToGrid(checked)}>
                            Snap to Grid
                            <MenubarShortcut>Ctrl+G</MenubarShortcut>
                        </MenubarCheckboxItem>

                    </MenubarContent>
                </MenubarMenu>

                <Button onClick={handleSignout}>Sign out</Button>
                {/* <GardenName /> */}

                {/* <Input defaultValue={name} /> */}
                <MenubarMenu>
                    <MenubarTrigger className="ms-auto">Share</MenubarTrigger>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}