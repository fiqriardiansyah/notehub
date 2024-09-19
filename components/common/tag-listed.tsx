"use client";

import { Tag } from "@/models/note";
import { icons } from "lucide-react";
import React from "react";

export type ResponsiveTagsListedProps = {
    tags?: Tag[];
    size?: number;
}

export default function ResponsiveTagsListed({ tags = [], size = 16 }: ResponsiveTagsListedProps) {
    const [itemCount, setItemCount] = React.useState(0);
    const containerRef = React.useRef<any>(null);

    const itemWidth = size;

    React.useEffect(() => {
        const updateItemCount = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const newCount = Math.floor(containerWidth / itemWidth);
                setItemCount(newCount);
            }
        };

        updateItemCount();

        window.addEventListener('resize', updateItemCount);

        return () => window.removeEventListener('resize', updateItemCount);
    }, []);

    const countRest = (tags.length + 1) - itemCount

    if (!tags.length) return null;

    return (
        <div ref={containerRef} className="w-full flex gap-1 flex-1 overflow-hidden">
            {[...tags]?.slice(0, itemCount - 1).map((tag) => {
                const Icon = icons[tag.icon as keyof typeof icons];
                return <Icon size={size} key={tag.id} className="text-gray-700" />
            })}
            {countRest > 0 ? <span className="text-gray-500 text-xs">{countRest}+</span> : null}
        </div>
    );
}
