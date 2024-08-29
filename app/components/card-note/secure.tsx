"use client"

import { LockKeyhole } from "lucide-react"

export default function Secure({ size = 60 }: { size?: number }) {
    return (
        <div className="h-[70px] w-full flex items-center justify-center">
            <LockKeyhole size={size} className="text-gray-500" />
        </div>
    )
}