import { getQueryClient } from "@/app/get-query-client";
import { getPlants } from "@/lib/actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CanvasLazyLoader from "./_canvas/CanvasLazyLoader";
import BottomMenu from "./_components/BottomMenu";
import MenuBar from "./_components/MenuBar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Garden Sketch",
}

export default async function Page() {

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['plants'],
        queryFn: getPlants
    })

    return (
        <div>

            <CanvasLazyLoader />
            <MenuBar />
            {/* <InfoPanel /> */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <BottomMenu className="" />
            </HydrationBoundary>
        </div>

    )
}