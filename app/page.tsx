"use client";

import CardFolder from "@/components/card-folder";
import CardNote from "@/components/card-note";
import HabitsAlert from "@/components/habits/habits-alert";
import LayoutGrid from "@/components/layout-grid";
import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar/mobile";
import SelectToolbar from "@/components/select-tool-bar.tsx";
import { SelectToolBarProvider } from "@/components/select-tool-bar.tsx/provider";
import SettingNoteDrawer from "@/components/setting-note-drawer";
import StateRender from "@/components/state-render";
import ToolBar from "@/components/tool-bar";
import { NoteContext, NoteContextType } from "@/context/note";
import { Note, Tag } from "@/models/note";
import noteService from "@/service/note";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ReactDom from "react-dom";
import ButtonToWrite from "./habits/components/button-make-habit";
import { useMobileMediaQuery } from "@/hooks/responsive";
import { cn } from "@/lib/utils";

export default function IndexPage() {
  const {
    note: { changesRandomId },
  } = React.useContext(NoteContext) as NoteContextType;
  const [orderList, setOrderList] = React.useState<"desc" | "asc">("desc");
  const [filterTag, setFilterTag] = React.useState<Tag[]>([]);
  const isMobile = useMobileMediaQuery();

  const itemsQuery = useQuery([noteService.getAllItems.name, orderList, changesRandomId], async () => {
    return (await noteService.getAllItems(orderList)).data.data;
  });

  React.useEffect(() => {
    itemsQuery.refetch();
  }, []);

  const renderTopNav = () => {
    return (
      typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
    );
  };

  const onClickModified = () => {
    setOrderList((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const tags = itemsQuery.data
    ?.map((item) => (item.type === "folder" ? null : item.tags))
    .filter(Boolean)
    .flat() as Tag[];

  const filteredItems = itemsQuery.data?.filter((i) => {
    if (!filterTag.length) return true;
    if (i.type === "folder") return false;
    return !!i.tags?.find((t) => !!filterTag.find((tag) => tag.id === t.id));
  });

  return (
    <SelectToolBarProvider notes={itemsQuery.data as Note[]}>
      {(context) => (
        <>
          {renderTopNav()}
          <div className="container-custom pb-20 min-h-screen grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3 relative">
            <HabitsAlert>{(component) => <div className={cn(isMobile ? "" : "sticky top-0 h-fit")}>{component}</div>}</HabitsAlert>
            <div className={cn("w-full", isMobile ? "" : "-order-1")}>
              <div className="w-full sticky z-10 top-0 left-0 bg-white py-2">
                {context?.selectToolbar?.selectedNotes?.length ? (
                  <SelectToolbar tools={["deleted", "add_folder"]} />
                ) : (
                  <ToolBar filterTag={filterTag} setFilterTag={setFilterTag} tags={tags} order={orderList} onClickModified={onClickModified} />
                )}
              </div>
              <StateRender data={itemsQuery.data} isLoading={itemsQuery.isLoading}>
                <StateRender.Data>
                  <div className="w-full my-7">
                    {filteredItems?.length ? (
                      <LayoutGrid items={filteredItems} minWidthItem={isMobile ? 140 : 250}>
                        {(item) => {
                          if (item.type === "folder") return <CardFolder {...item} key={item.id} />;
                          return <CardNote note={item as Note} key={item.id} attachMenu={(note) => <SettingNoteDrawer.Attach note={note} />} />;
                        }}
                      </LayoutGrid>
                    ) : (
                      <ButtonToWrite href="/write?type=freetext" title="There is no notes available" />
                    )}
                  </div>
                </StateRender.Data>
                <StateRender.Loading>
                  <p>Getting Notes...</p>
                </StateRender.Loading>
              </StateRender>
            </div>
          </div>
          <SettingNoteDrawer.BottomSheet refetch={itemsQuery.refetch} />
          <BottomBar />
        </>
      )}
    </SelectToolBarProvider>
  );
}
