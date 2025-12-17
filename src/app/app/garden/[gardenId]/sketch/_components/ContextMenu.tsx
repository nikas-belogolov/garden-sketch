import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { contextMenuIsVisibleAtom, contextMenuPositionAtom } from "@/lib/garden-canvas"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useRef } from "react";

export function ContextMenu() {

    const position = useAtomValue(contextMenuPositionAtom)
    const [isVisible, setIsVisible] = useAtom(contextMenuIsVisibleAtom)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            // Check if the click is outside the context menu
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsVisible(false);
            }
        }

        window.addEventListener("click", handleClick)

        return () => {
            window.removeEventListener("click", handleClick)
        }
    }, [])

    return (
        <DropdownMenu open={isVisible} >
            <DropdownMenuContent style={{
                top: position.y,
                left: position.x,
                position: "fixed",
                // zIndex: 100
            }} ref={ref}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        // <ContextMenuWrapper modal={true}  >
        //     <ContextMenuContent style={{

        //     }}>
        //         <ContextMenuItem>Profile</ContextMenuItem>
        //         <ContextMenuItem>Billing</ContextMenuItem>
        //         <ContextMenuItem>Team</ContextMenuItem>
        //         <ContextMenuItem>Subscription</ContextMenuItem>
        //     </ContextMenuContent>
        // </ContextMenuWrapper>
        // <div className="space-y-2 text-xs text-muted-foreground fixed"
        //         onClick={(e) => e.stopPropagation()}
        //         style={{
        //             top: position.y,
        //             left: position.x
        //         }}>
        //     <div className="flex justify-between">
        //         <span>Delete</span>
        //         <kbd className="px-2 py-0.5 text-xs font-semibold border rounded">Del</kbd>
        //     </div>
        //     <div className="flex justify-between">
        //         <span>Duplicate</span>
        //         <kbd className="px-2 py-0.5 text-xs font-semibold border rounded">Ctrl+D</kbd>
        //     </div>
        //     <div className="flex justify-between">
        //         <span>Undo</span>
        //         <kbd className="px-2 py-0.5 text-xs font-semibold border rounded">Ctrl+Z</kbd>
        //     </div>
        //     <div className="flex justify-between">
        //         <span>Redo</span>
        //         <kbd className="px-2 py-0.5 text-xs font-semibold border rounded">Ctrl+Y</kbd>
        //     </div>
        // </div>
    )
}