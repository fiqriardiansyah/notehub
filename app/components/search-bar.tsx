"use client";

import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

export default function SearchBar() {
  return (
    <label htmlFor="search" className="relative w-full">
      <CiSearch className="text-xl absolute top-1/2 transform -translate-y-1/2 left-2 z-10" />
      <Input
        name="search"
        type="text"
        placeholder="Search Notes"
        className="flex-1 rounded-full pl-8"
      />
    </label>
  );
}
