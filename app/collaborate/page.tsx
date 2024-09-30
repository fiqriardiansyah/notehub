/* eslint-disable react/no-unescaped-entities */
"use client";

import chattingAnim from "@/asset/animation/chatting.json";
import BottomBar from "@/components/navigation-bar/bottom-bar";
import TopBar from "@/components/navigation-bar/top-bar";
import StateRender from "@/components/state-render";
import collabService from "@/service/collab";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import ReactDom from 'react-dom';
import Lottie from "react-lottie";
import CardNoteCollab from "../components/card-note-collab";
import LayoutGrid from "../components/layout-grid";
import SettingNoteDrawer from "../components/setting-note-drawer";
import ToolBar from "../components/tool-bar";

const defaultOptions = {
    animationData: chattingAnim,
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default function CollaboratePage() {
    const [orderList, setOrderList] = React.useState<"desc" | "asc">("desc");

    const projectsQuery = useMutation([collabService.getMyCollaborateProject.name, orderList], async () => {
        return (await collabService.getMyCollaborateProject(orderList)).data.data;
    });

    React.useEffect(() => { projectsQuery.mutate() }, [orderList]);

    const renderTopNav = () => {
        return typeof document !== "undefined" && document.querySelector("#top-nav") && ReactDom.createPortal(<TopBar />, document.querySelector("#top-nav")!)
    }

    const onClickModified = () => {
        setOrderList((prev) => prev === "desc" ? "asc" : "desc");
    }

    return (
        <>
            {renderTopNav()}
            <div className="container-custom pb-20 min-h-screen">
                <ToolBar order={orderList} onClickModified={onClickModified} />
                <StateRender data={projectsQuery.data} isLoading={projectsQuery.isLoading}>
                    <StateRender.Data>
                        {projectsQuery.data?.length ?
                            <LayoutGrid items={projectsQuery.data}>
                                {(item) => <CardNoteCollab note={item} key={item.id} />}
                            </LayoutGrid> :
                            <div className="min-h-[400px] flex flex-col items-center justify-center">
                                <Lottie options={defaultOptions} width={250} height={250} style={{ pointerEvents: 'none' }} />
                                <h3 className="mt-4">Join other people's project as collaborators</h3>
                            </div>
                        }
                    </StateRender.Data>
                    <StateRender.Loading>
                        <p>Getting Notes...</p>
                    </StateRender.Loading>
                </StateRender>
            </div>
            <SettingNoteDrawer.CollabBottomSheet refetch={projectsQuery.mutate} />
            <BottomBar />
        </>
    );
}
