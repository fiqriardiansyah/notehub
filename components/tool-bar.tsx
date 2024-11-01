"use client";

import { Button } from "@/components/ui/button";
import { Tag } from "@/models/note";
import Chip from "@/module/tags/chip";
import { motion } from "framer-motion";
import React from "react";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { useSelectToolBar } from "./select-tool-bar.tsx/provider";
import SelectToolbar from "./select-tool-bar.tsx";

export type ToolbarProps = {
  rightAddition?: () => React.ReactNode;
  onClickModified?: () => void;
  order?: "desc" | "asc";
  tags?: Tag[];
  setFilterTag?: React.Dispatch<React.SetStateAction<Tag[]>>;
  filterTag?: Tag[];
};

export default function ToolBar({
  rightAddition,
  onClickModified,
  order,
  tags,
  setFilterTag,
  filterTag,
}: ToolbarProps) {
  const onClick = () => {
    if (onClickModified) {
      onClickModified();
    }
  };

  const removedDuplicateTags = tags
    ?.reduce((tags: Tag[], tag: Tag) => {
      if (tags.find((t) => t.id === tag.id)) return tags;
      return [...tags, tag];
    }, [] as Tag[])
    .sort((a, b) =>
      a.text.localeCompare(b.text, undefined, { sensitivity: "base" })
    );

  const onClickTag = (tag: Tag) => {
    return () => {
      if (setFilterTag)
        setFilterTag((prev) => {
          if (prev.find((t) => t.id === tag.id))
            return prev?.filter((t) => t.id !== tag.id);
          return [...prev, tag];
        });
    };
  };

  const onClickReset = () => {
    if (setFilterTag) setFilterTag([]);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClick}
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
          >
            {order === "desc" ? (
              <GoArrowDown className="text-xl" />
            ) : (
              <GoArrowUp className="text-xl" />
            )}
            {order === "desc" ? "Last" : "Old"} Modified
          </Button>
          {removedDuplicateTags?.length && filterTag?.length ? (
            <button
              onClick={onClickReset}
              className="my-1 text-red-400 text-xs font-semibold hover:text-gray-500"
            >
              Reset
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {rightAddition && rightAddition()}
        </div>
      </div>
      <div className="overflow-x-auto flex gap-1 flex-nowrap">
        {removedDuplicateTags?.map((tag) => (
          <motion.div
            key={tag.id + "visible"}
            animate={{ scale: 1, width: "auto" }}
            exit={{ scale: 0, width: 0 }}
            className="pr-2 py-2"
          >
            <Chip
              onClick={onClickTag(tag)}
              pick={!!filterTag?.find((t) => t.id === tag.id)}
              tag={tag}
              withTooltip={false}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
