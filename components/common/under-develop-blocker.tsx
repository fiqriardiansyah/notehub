"use client";

import { Construction } from "lucide-react";
import React from "react";

type UnderDevelopBlockerProps = React.HTMLProps<HTMLDivElement>

export default function UnderDevelopBlocker({ children }: UnderDevelopBlockerProps) {
    const modifyChild = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                className: `${child.props.className} blur-sm pointer-events-none`.trim(),
                onClick: () => { }
            } as any);
        };
        return child;
    })

    if (process.env.NODE_ENV !== "production") return children;

    return <div className="pointer-events-none relative">
        <div className="flex items-center gap-2 font-semibold text-sm absolute justify-center w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Feature under construction <Construction className="text-red-400" size={16} />
        </div>
        {modifyChild}
    </div>
}