import Canvas from "./_components/Canvas";
import BottomMenu from "./_components/ui/BottomMenu";
import ToolBar from "./_components/ui/ToolBar";
import MenuBar from "./_components/ui/MenuBar";
import CanvasLazyLoader from "./_components/CanvasLazyLoader";
import { getPlants } from "@/lib/actions";
import { getQueryClient } from "@/app/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import InfoPanel from "./_components/ui/InfoPanel";

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
                <BottomMenu className="absolute md:mx-auto md:left-0 md:right-0 md:w-9/12 lg:w-8/12 md:bottom-4 md:rounded-xl  w-dvw  h-[180px]" />
            </HydrationBoundary>
        </div>
        
    )
}