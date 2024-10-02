"use client";

import TopBar from "@/components/navigation-bar/top-bar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Layout({ children }: { children: any }) {
    const session = useSession();

    return <div className="w-screen min-h-screen">
        {!session.data?.user?.id ? (
            <header className="sticky top-0 left-0 z-50 bg-white w-full border-b border-solid border-gray-200">
                <nav className="py-2 container-custom w-full flex items-center justify-between">
                    <p className="text-lg font-semibold">NoteSpaceHub</p>
                    <Link href="/signin">
                        <Button variant="default">
                            Signin
                        </Button>
                    </Link>
                </nav>
            </header>
        ) : <div className="w-full sticky top-0 left-0 z-50">
            <TopBar />
        </div>}
        <div className="w-full pb-20 pt-2">
            {children}
        </div>
    </div>
}