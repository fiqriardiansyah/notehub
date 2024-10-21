"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommonContext, CommonContextType } from "@/context/common";
import { useDesktopMediaQuery, useTabletMediaQuery } from "@/hooks/responsive";
import { CollaborateProject } from "@/models/collab";
import { ChevronRight } from "lucide-react";
import React from "react";
import { WithFunctionalityHOCProps } from ".";
import Image from "next/image";

export type AttachType = WithFunctionalityHOCProps & {
  note?: CollaborateProject;
  children?: any;
};

export default function Attach({
  children,
  currentNote,
  note,
  onOpenChange,
  settings,
  handleClickSetting,
  isLoading,
}: AttachType) {
  const { common } = React.useContext(CommonContext) as CommonContextType;
  const isTablet = useTabletMediaQuery();
  const isDesktop = useDesktopMediaQuery();
  const [blockClick, setBlockClick] = React.useState(false);

  React.useEffect(() => {
    if (common?.sidePageOpen) {
      setBlockClick(true);
    }

    const timeout = setTimeout(() => {
      if (!common?.sidePageOpen) {
        setBlockClick(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [common?.sidePageOpen]);

  const isOpen =
    !!currentNote && currentNote?.id === note?.id && !common?.sidePageOpen;

  if (isTablet || isDesktop) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-[25px] h-[25px] rounded-full bg-slate-300">
              <Image
                title={currentNote?.ownerName || ""}
                height={25}
                width={25}
                alt={currentNote?.ownerName || ""}
                src={currentNote?.ownerImage || ""}
                className="rounded-full object-cover bg-gray-200"
              />
            </div>
            <p className="m-0 text-xs">{`${currentNote?.ownerName}'s Project`}</p>
          </div>
          <DropdownMenuGroup>
            {settings?.map((Setting) => (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (blockClick) return;
                  handleClickSetting(Setting)();
                }}
                disabled={isLoading()}
                loading={isLoading(Setting)}
                key={Setting.text}
                className="cursor-pointer"
                variant={Setting.danger ? "danger" : null}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Setting.icon />
                  {Setting.text}
                </div>
                {Setting?.rightElement ? (
                  Setting?.rightElement
                ) : (
                  <ChevronRight />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return null;
}
