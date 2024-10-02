"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return <div className="container-read">
        <Skeleton className="w-[300px] h-[20px] mb-5" />
        <Skeleton className="w-[80%] h-[20px] mb-1" />
        <Skeleton className="w-[70%] h-[20px] mb-1" />
        <Skeleton className="w-[90%] h-[20px] mb-4" />
        <Skeleton className="w-[70%] h-[20px] mb-1" />
        <Skeleton className="w-[90%] h-[20px] mb-4" />
        <Skeleton className="w-[40%] h-[40px] mb-1" />
    </div>
}