"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="container-read mt-3 flex h-[400px] items-center justify-center flex-col">
            <h1 className="text-red-500">{error?.message}</h1>
        </div>
    )
}