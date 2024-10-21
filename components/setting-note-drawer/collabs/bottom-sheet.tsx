"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMobileMediaQuery } from "@/hooks/responsive";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { WithFunctionalityHOCProps } from ".";

export default function BottomSheet({
  onOpenChange,
  isOpen,
  currentNote,
  settings,
  isLoading,
  handleClickSetting,
}: WithFunctionalityHOCProps) {
  const isMobile = useMobileMediaQuery();

  if (!isMobile) return null;
  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="z-50">
          <DrawerHeader>
            <DrawerTitle className="capitalize">
              {currentNote?.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col p-4 gap-3">
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
              <p className="m-0">{`${currentNote?.ownerName}'s Project`}</p>
            </div>
            {settings?.map((Setting) => (
              <Button
                key={Setting.text}
                loading={isLoading(Setting)}
                disabled={isLoading()}
                onClick={handleClickSetting(Setting)}
                className="flex items-center gap-3 justify-between"
                variant={Setting.danger ? "destructive" : "ghost"}
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
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
