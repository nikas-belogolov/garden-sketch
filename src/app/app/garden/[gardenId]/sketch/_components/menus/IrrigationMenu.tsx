import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function IrrigationMenu({ className }: { className?: string }) {
    return (
        <div className={cn("h-full w-full", className)}>
            <ScrollArea className="h-full w-full p-4">
                <div className="text-muted-foreground text-center">
                    Irrigation Menu (Sprinklers, Drip lines, etc.) - Coming Soon
                </div>
            </ScrollArea>
        </div>
    );
}
