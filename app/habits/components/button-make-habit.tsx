"use client";

import Link from "next/link";

export type ButtonToWriteProps = {
    href: string;
    title?: string
}

export default function ButtonToWrite({ href, title = "There is no habit available" }: ButtonToWriteProps) {
    return (
        <div className='font-medium text-center self-center flex w-full flex-col items-center justify-center h-full'>
            {title}<br />
            <Link href={href} className='text-blue-500'>Make one +</Link>
        </div>
    )
}