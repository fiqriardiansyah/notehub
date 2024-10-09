"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";

export default function Layout({ children }: { children: any }) {
    const session = useSession();
    const router = useRouter();

    if (!session?.data) return children;
    return <div className="">
        <Button onClick={() => router.back()} size="icon" variant="ghost" className="absolute top-1 left-1">
            <ChevronLeft />
        </Button>
        {children}
    </div>
}