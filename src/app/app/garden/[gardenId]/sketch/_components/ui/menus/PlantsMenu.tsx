'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectGroup } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import useDebounce from "@/lib/hooks/debounce";
import { getPlants } from "@/lib/actions";
import { currentDraggedObject } from "@/lib/stores/gardenLayoutAtoms";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { LuHeartHandshake } from "react-icons/lu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Fuse from "fuse.js";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function PlantsMenu({
    className
}: {
    className?: string
}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [companionMode, setCompanionMode] = useState(false);
    const [selectedSunlightRequirement, setSelectedSunlightRequirement] = useState("any-light");

    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    const { isPending, error, data } = useQuery({
        queryKey: ['plants'],
        queryFn: () => getPlants(),
        initialData: []
    })

    const [filteredPlants, setFilteredPlants] = useState(data)
    const [filteredPlantsCount, setFilteredPlantsCount] = useState(data.length)
    const [isFiltering, startTransition] = useTransition();


    useEffect(() => {

        startTransition(() => {
            const fuse = new Fuse(data, {
                threshold: 0.3,
                keys: companionMode ? ["goodCompanions"] : ['commonName', 'scientificName'],
            })

            const results = debouncedSearchQuery.trim() == "" ? data : fuse.search(debouncedSearchQuery).map(result => result.item);

            const newFilteredPlants = results.filter(plant =>
                (selectedCategory === "all" || plant.category === selectedCategory) &&
                (selectedSunlightRequirement === "any-light" ||
                    plant.sunlightRequirements.includes(selectedSunlightRequirement))
            )

            setFilteredPlants(newFilteredPlants);
            setFilteredPlantsCount(newFilteredPlants.length)
        })

    }, [data, debouncedSearchQuery, selectedCategory, companionMode, selectedSunlightRequirement])

    const setDraggedShape = useSetAtom(currentDraggedObject);

    return (
        <div className={cn("bg-sidebar border flex flex-col", className)}>
            <ScrollArea>
                <div className="flex gap-4 p-3">
                    <InputGroup className="w-[350px]">
                        <InputGroupInput onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search plants, flowers, trees..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{filteredPlantsCount} results</InputGroupAddon>
                    </InputGroup>

                    <Toggle className="shrink-0" variant="outline" pressed={companionMode} onPressedChange={() => setCompanionMode(!companionMode)}>
                        <LuHeartHandshake size={20} />
                        <span>Companion Mode</span>
                    </Toggle>

                    <Label htmlFor="sort-by">Category:</Label>
                    <Select defaultValue="all" onValueChange={(value: string) => setSelectedCategory(value)}>
                        <SelectTrigger className="w-[150px]" id="sort-by">
                            <SelectValue   />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="tree">Trees</SelectItem>
                            <SelectItem value="shrub">Shrubs</SelectItem>
                            <SelectItem value="flower">Flowers</SelectItem>
                            <SelectItem value="vegetable">Vegetables</SelectItem>
                            <SelectItem value="herb">Herbs</SelectItem>
                            <SelectItem value="grass">Grasses</SelectItem>
                        </SelectContent>
                    </Select>


                    <Label htmlFor="sun">Sun:</Label>
                    <Select defaultValue="any-light" onValueChange={(value: string) => setSelectedSunlightRequirement(value)}>
                        <SelectTrigger className="w-[150px]" id="sun">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any-light">Any Light</SelectItem>
                            <SelectItem value="full-sun">Full Sun</SelectItem>
                            <SelectItem value="partial-sun">Partial Sun</SelectItem>
                            <SelectItem value="shade">Shade</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator  />
            <ScrollArea className="min-h-[110px] flex-1">
                <div className='p-4 flex gap-3'>
                    {isPending || isFiltering ? (
                        <p className="text-center text-lg text-muted-foreground">Loading plants...</p>
                    ) : error ? (
                        <p className="text-center text-lg text-muted-foreground">Error while loading plants.</p>
                    ) : filteredPlants.length === 0 ? (
                        <p className="text-center text-lg text-muted-foreground">No plants found for your search.</p>
                    ) : (
                        filteredPlants.map((plant) => (
                            <div key={plant.commonName + plant.scientificName} className="inline-flex flex-col gap-1 w-10 items-center" draggable onDragStart={() => setDraggedShape({...plant, type: "plant"})}>
                                <div className="w-8 aspect-square relative">
                                    {plant.img && <Image src={`/illustrations/${plant.img}`} alt={plant.commonName} fill={true} />}
                                </div>
                                <p className="text-center mt-2 text-muted-foreground text-xs">{plant.commonName}</p>
                            </div>
                        ))
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}