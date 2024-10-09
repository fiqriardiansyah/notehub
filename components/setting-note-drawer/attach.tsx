"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesktopMediaQuery, useTabletMediaQuery } from "@/hooks/responsive";
import { Note } from "@/models/note";
import { WithFunctionalityHOCProps } from ".";
import { ChevronRight } from "lucide-react";
import { CommonContext, CommonContextType } from "@/context/common";
import React from "react";

export type AttachType = WithFunctionalityHOCProps & {
  note?: Note;
  children?: any;
};

export default function Attach({ children, currentNote, note, onOpenChange, settings, handleClickSetting, isLoading }: AttachType) {
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

  const isOpen = !!currentNote && currentNote?.id === note?.id && !common?.sidePageOpen;

  if (isTablet || isDesktop) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
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
                {Setting?.rightElement ? Setting?.rightElement : <ChevronRight />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null;
}
