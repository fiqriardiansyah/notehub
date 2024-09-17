"use client";

import { MODE_WRITE } from "@/app/write/components/mode-write";
import Item, { ItemProps } from "./item";
import { v4 as uuid } from "uuid";

const menus: ItemProps["item"][] = [
    {
        id: uuid(),
        isMenu: true,
        href: "/write?type=freetext",
        icon: MODE_WRITE.find((m) => m.mode === "freetext")?.icon,
        title: "Make Freetext Note 📒",

    },
    {
        id: uuid(),
        isMenu: true,
        href: "/write?type=todolist",
        icon: MODE_WRITE.find((m) => m.mode === "todolist")?.icon,
        title: "Make New Todolist "
    },
    {
        id: uuid(),
        isMenu: true,
        href: "/write?type=habits",
        icon: MODE_WRITE.find((m) => m.mode === "habits")?.icon,
        title: "Make new Habits 🎖️"
    },
]

type OtherItemProps = {
    query?: string;
}

export default function OtherItem({ query }: OtherItemProps) {
    const filter = menus.filter((m) => m?.title?.toLocaleLowerCase().includes(query?.toLocaleLowerCase() || ""));
    if (!filter.length) return null;
    return (
        <>
            <h1 className="mt-7">Other suggestion</h1>
            <div className="grid mt-2 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-1 gap-2">
                {filter.map((menu) => <Item key={menu?.id} item={menu} />)}
            </div>
        </>
    )
}