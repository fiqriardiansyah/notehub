"use client";

import { Button } from "@/components/ui/button";
import SecurePassword from "./secure-password";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";

export default function SecurePasswordPage() {
    const router = useRouter();

    const onClickBack = () => {
        router.back();
    }

    const onFinish = () => {

    }

    return (
        <div className="h-full w-full flex flex-col p-4">
            <Button onClick={onClickBack} title="Back" size="icon" variant="ghost" className="!w-10">
                <ChevronLeft />
            </Button>
            <div className="w-full container-read mt-3">
                <SecurePassword onFinish={onFinish} />
            </div>
        </div>
    )
}