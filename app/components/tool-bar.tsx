"use client";

import { Button } from "@/components/ui/button";
import { CiGrid41 } from "react-icons/ci";
import { GoArrowDown } from "react-icons/go";
import SearchBar from "./search-bar";

export default function ToolBar() {
  return (
    <div className="container-custom flex items-center justify-between my-4 gap-8">
      <Button size="sm" variant="ghost" className="flex items-center gap-2">
        <GoArrowDown className="text-xl" />
        Last Modified
      </Button>
      <div className="flex-1 hidden md:block">
        <SearchBar />
      </div>
      <button className="bg-none cursor-pointer p-2 text-2xl">
        <CiGrid41 />
      </button>
    </div>
  );
}
