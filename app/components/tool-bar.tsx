"use client";

import { Button } from "@/components/ui/button";
import { CiGrid41 } from "react-icons/ci";
import { GoArrowDown } from "react-icons/go";
import SearchBar from "./search-bar";
import React from "react";

export type ToolbarProps = {
  rightAddition?: () => React.ReactNode;
}

export default function ToolBar({ rightAddition }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between my-4 gap-8 sticky top-0 left-0 bg-slate-50">
      <Button size="sm" variant="ghost" className="flex items-center gap-2">
        <GoArrowDown className="text-xl" />
        Last Modified
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
