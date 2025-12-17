'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LuMousePointer2 } from "react-icons/lu";
import { RxText } from "react-icons/rx";
import { RiRectangleLine } from "react-icons/ri";
import { PiCaretDownBold } from "react-icons/pi";

export default function ToolBar() {
    return (
        <div className="bg-primary-foreground absolute border rounded-md my-auto top-0 bottom-0 start-4 h-fit flex flex-col">
            <Button variant="ghost" className="rounded-full p-2 m-2" >
                <LuMousePointer2 size={20} />
            </Button>
            <Separator />
            <Button variant="ghost" className="rounded-full p-2 m-2" >
                <RiRectangleLine size={20} />
                <PiCaretDownBold size={10} className="ms-1" />
            </Button>
            <Separator />
            <Button variant="ghost" className="rounded-full p-2 m-2" >
                <RxText size={20} />
            </Button>
            
        </div>
    )
}