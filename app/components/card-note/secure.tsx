"use client"

import { LockKeyhole } from "lucide-react"

export default function Secure() {
    return (
        <div className="h-[100px] w-full flex items-center justify-center">
            <LockKeyhole size={60} className="text-gray-500" />
        </div>
    )
}