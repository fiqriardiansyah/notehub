/* eslint-disable react/no-unescaped-entities */
"use client";

import chattingAnim from "@/asset/animation/chatting.json";
import CardNoteCollab from "@/components/card-note-collab";
import LayoutGrid from "@/components/layout-grid";
import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar/mobile";
import SettingNoteCollabDrawer from "@/components/setting-note-drawer/collabs";
import StateRender from "@/components/state-render";
import ToolBar from "@/components/tool-bar";
import { NoteContext, NoteContextType } from "@/context/note";
import { Tag } from "@/models/note";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import ReactDom from "react-dom";
import Lottie from "react-lottie";

const defaultOptions = {
  animationData: chattingAnim,
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function CollaboratePage() {
  const {
    note: { changesRandomId },
  } = React.useContext(NoteContext) as NoteContextType;
  const [orderList, setOrderList] = React.useState<"desc" | "asc">("desc");
  const [filterTag, setFilterTag] = React.useState<Tag[]>([]);

  const projectsQuery = useMutation([collabService.getMyCollaborateProject.name, orderList, changesRandomId], async () => {
    return (await collabService.getMyCollaborateProject(orderList)).data.data;
  });

  React.useEffect(() => {
    projectsQuery.mutate();
  }, [orderList, changesRandomId]);

  const renderTopNav = () => {
    return (
      typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
    );
  };

  const onClickModified = () => {
    setOrderList((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const tags = projectsQuery.data
    ?.map((item) => item.tags)
    .filter(Boolean)
    .flat() as Tag[];

  const filteredItems = projectsQuery.data?.filter((i) => {
    if (!filterTag.length) return true;
    return !!i.tags?.find((t) => !!filterTag.find((tag) => tag.id === t.id));
  });

  return (
    <>
      {renderTopNav()}
      <div className="container-custom pb-20 min-h-screen">
        <div className="w-full sticky z-10 top-0 left-0 bg-white py-2">
          <ToolBar filterTag={filterTag} setFilterTag={setFilterTag} tags={tags} order={orderList} onClickModified={onClickModified} />
        </div>
        <div className="h-[20px]"></div>
        <StateRender data={projectsQuery.data} isLoading={projectsQuery.isLoading}>
          <StateRender.Data>
            {filteredItems?.length ? (
              <LayoutGrid items={filteredItems}>
                {(item) => <CardNoteCollab note={item} key={item.id} attachMenu={(note) => <SettingNoteCollabDrawer.Attach note={note} />} />}
              </LayoutGrid>
            ) : (
              <div className="min-h-[400px] flex flex-col items-center justify-center">
                <Lottie options={defaultOptions} width={250} height={250} style={{ pointerEvents: "none" }} />
                <h3 className="mt-4">Join other people's project as collaborators</h3>
              </div>
            )}
          </StateRender.Data>
          <StateRender.Loading>
            <p>Getting Notes...</p>
          </StateRender.Loading>
        </StateRender>
      </div>
      <SettingNoteCollabDrawer.BottomSheet />
      <BottomBar />
    </>
  );
}
