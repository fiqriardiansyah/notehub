"use client";

import { Button } from "@/components/ui/button";
import { Tag } from "@/models/note";
import Chip from "@/module/tags/chip";
import { motion } from "framer-motion";
import React from "react";
import { CiGrid41 } from "react-icons/ci";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import Slider from "react-slick";

export type ToolbarProps = {
  rightAddition?: () => React.ReactNode;
  onClickModified?: () => void;
  order?: "desc" | "asc";
  tags?: Tag[];
  setFilterTag?: React.Dispatch<React.SetStateAction<Tag[]>>;
  filterTag?: Tag[];
}

export default function ToolBar({ rightAddition, onClickModified, order, tags, setFilterTag, filterTag }: ToolbarProps) {

  const onClick = () => {
    if (onClickModified) {
      onClickModified();
    }
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: undefined,
    prevArrow: undefined,
    variableWidth: true,
  };

  const removedDuplicateTags = tags?.reduce((tags: Tag[], tag: Tag) => {
    if (tags.find((t) => t.id === tag.id)) return tags;
    return [...tags, tag]
  }, [] as Tag[]);

  const onClickTag = (tag: Tag) => {
    return () => {
      if (setFilterTag)
        setFilterTag((prev) => {
          if (prev.find((t) => t.id === tag.id)) return prev?.filter((t) => t.id !== tag.id);
          return [...prev, tag]
        })
    }
  }

  const onClickReset = () => {
    if (setFilterTag) setFilterTag([]);
  }

  return (
    <div className="flex flex-col gap-1 sticky z-10 top-0 left-0 bg-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={onClick} size="sm" variant="ghost" className="flex items-center gap-2">
            {order === "desc" ? <GoArrowDown className="text-xl" /> : <GoArrowUp className="text-xl" />}
            {order === "desc" ? "Last" : "Old"} Modified
          </Button>
          {(removedDuplicateTags?.length && filterTag?.length) ? <button onClick={onClickReset} className="my-1 text-red-400 text-xs font-semibold hover:text-gray-500">Reset</button> : null}
        </div>
        <div className="flex items-center gap-1">
          {rightAddition && rightAddition()}
          <button className="bg-none cursor-pointer p-2 text-2xl">
            <CiGrid41 />
          </button>
        </div>
      </div>
      <div className="overflow-x-hidden">
        {removedDuplicateTags?.length ? (
          <Slider {...settings}>
            {removedDuplicateTags?.map((tag) => (
              <motion.div key={tag.id + "visible"} animate={{ scale: 1, width: 'auto' }} exit={{ scale: 0, width: 0 }} className="pr-2 py-2">
                <Chip onClick={onClickTag(tag)} pick={!!filterTag?.find((t) => t.id === tag.id)} tag={tag} withTooltip={false} />
              </motion.div>
            ))}
          </Slider>
        ) : null}
      </div>
    </div>
  );
}
