"use client";

import { Input, InputProps } from "@/components/ui/input";
import React from "react";
import { CiSearch } from "react-icons/ci";

type SearchBarProps = InputProps;

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ ...props }, ref) => {
  return (
    <label htmlFor="search" className="relative w-full">
      <CiSearch className="text-xl absolute top-1/2 transform -translate-y-1/2 left-2 z-10 pointer-events-none" />
      <Input
        ref={ref}
        id="search"
        name="search"
        type="text"
        placeholder="Search Notes"
        className="flex-1 rounded-full pl-8 active:ring-0 focus-visible:ring-0"
        {...props}
      />
    </label>
  )
});

SearchBar.displayName = "SearchBar"

export default SearchBar;