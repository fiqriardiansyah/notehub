"use client";

import { InputProps } from "@/components/ui/input";
import React from "react";
import { CiSearch } from "react-icons/ci";

type SearchBarProps = InputProps & {
  containerProps?: React.HTMLProps<HTMLLabelElement>;
};

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, containerProps, ...props }, ref) => {
  return (
    <label htmlFor="search" {...containerProps} className={`relative w-full ${containerProps?.className}`}>
      <CiSearch className="text-xl absolute top-1/2 transform -translate-y-1/2 left-2 z-10 pointer-events-none" />
      <input
        ref={ref}
        id="search"
        name="search"
        type="text"
        placeholder="Search Notes"
        {...props}
        className={`flex-1 bg-transparent pl-8 py-2 focus:outline-none ${className}`}
      />
    </label>
  )
});

SearchBar.displayName = "SearchBar"

export default SearchBar;