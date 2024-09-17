"use client";

import { MODE_WRITE } from "@/app/write/components/mode-write";
import { Note } from "@/models/note";
import { Blocks } from "lucide-react";
import { useRouter } from "next-nprogress-bar";

export type ItemProps = {
    item?: Partial<Pick<Note, "id" | "type" | "title" | "todos">> & {
        isMenu?: boolean;
        href?: string;
        icon?: any;
        onClick?: () => void;
    }
}

export default function Item({ item }: ItemProps) {
    const router = useRouter();

    const Type = MODE_WRITE.find((m) => m.mode === item?.type)!

    const onClick = () => {
        if (item?.isMenu) {
            if (item?.href) {
                router.push(item.href);
                return;
            }
        }
        if (item?.type === "habits") {
            router.push(`/habits/${item.id}`);
            return;
        }
        router.push(`/write/${item?.id}`);
    }

    if (item?.isMenu) {
        const Icon = item?.icon || Blocks;
        return (
            <button onClick={item?.onClick || onClick} className="rounded p-1 line-clamp-1 flex gap-3 items-center hover:bg-gray-100">
                <Icon size={20} strokeWidth={0.7} />
                <div className="flex flex-col items-start">
                    <p className="line-clamp-1 capitalize text-xs font-semibold">{item?.title}</p>
                </div>
            </button>
        )
    }

    return <button onClick={onClick} className="rounded p-1 line-clamp-1 flex gap-3 items-center hover:bg-gray-100">
        {Type?.icon && <Type.icon size={20} strokeWidth={0.7} />}
        <div className="flex flex-col items-start">
            <p className="line-clamp-1 capitalize text-xs font-semibold">{item?.title}</p>
            {item?.todos?.length ? <span className="m-0 text-gray-400 text-xs">{item?.todos?.length} Task</span> : null}
        </div>
    </button>
}