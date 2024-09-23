"use client";

import { Button } from "@/components/ui/button";
import { CiGrid41 } from "react-icons/ci";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import SearchBar from "./search-bar";
import React from "react";

export type ToolbarProps = {
  rightAddition?: () => React.ReactNode;
  onClickModified?: () => void;
  order?: "desc" | "asc"
}

export default function ToolBar({ rightAddition, onClickModified, order }: ToolbarProps) {

  const onClick = () => {
    if (onClickModified) {
      onClickModified();
    }
  }

  return (
    <div className="flex items-center justify-between my-4 gap-8 sticky z-10 top-0 left-0 bg-white">
      <Button onClick={onClick} size="sm" variant="ghost" className="flex items-center gap-2">
        {order === "desc" ? <GoArrowDown className="text-xl" /> : <GoArrowUp className="text-xl" />}
        {order === "desc" ? "Last" : "Old"} Modified
      </Button>
      <div className="flex-1 hidden md:block">
        <SearchBar />
      </div>
      <div className="flex items-center gap-1">
        {rightAddition && rightAddition()}
        <button className="bg-none cursor-pointer p-2 text-2xl">
          <CiGrid41 />
        </button>
      </div>
    </div>
  );
}
