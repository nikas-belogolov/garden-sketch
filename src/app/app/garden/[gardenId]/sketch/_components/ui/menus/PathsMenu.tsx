import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function PathsMenu({ className }: { className?: string }) {
    return (
        <div className={cn("h-full w-full", className)}>
            <ScrollArea className="h-full w-full p-4">
                <div className="text-muted-foreground text-center">
                    Paths Menu (Stone, Gravel, Dirt, etc.) - Coming Soon
                </div>
            </ScrollArea>
        </div>
    );
}
