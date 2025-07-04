import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {
                    Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-1/3 rounded-lg "/>   
                    ))
                }
            </div>
            <div className="grid gap-6">
                <Skeleton className="h-[300px] w-full rounded-lg " />
                <Skeleton className="h-[300px] w-full rounded-lg " />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[300px] w-full rounded-lg " />
                    <Skeleton className="h-[300px] w-full rounded-lg " />
                </div>
            </div>
        </div>
    )
}

export default WeatherSkeleton