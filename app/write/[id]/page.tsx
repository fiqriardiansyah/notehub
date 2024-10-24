"use client";

import { BUTTON_SUCCESS_ANIMATION_TRIGGER } from "@/components/animation/button-success";
import CollabsList from "@/components/common/collabs-list";
import ResponsiveTagsListed from "@/components/common/tag-listed";
import ListImage from "@/components/file/list-image";
import OpenSecureNote from "@/components/open-secure-note";
import StateRender from "@/components/state-render";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteContext, NoteContextType } from "@/context/note";
import {
  ON_UPDATE_SUCCESS,
  WriteContext,
  WriteContextType,
  WriteStateType,
} from "@/context/write";
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import useProcess from "@/hooks/use-process";
import useStatusBar from "@/hooks/use-status-bar";
import { formatDate } from "@/lib/utils";
import { CreateNote } from "@/models/note";
import ShowedTags from "@/module/tags/showed-tags";
import noteService from "@/service/note";
import validation from "@/validation";
import { noteValidation } from "@/validation/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, FolderOpen } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { v4 as uuid } from "uuid";
import ListFile from "../../../components/file/list-file";
import ToolsBar, { ToolsType } from "../components/tool-bar";
import TodoListModeEditor, { Todo } from "../mode/todolist";
import TopToolBar from "../components/top-tool-bar";

const FreetextModeEditor = dynamic(
  () => import("../mode/freetext").then((mod) => mod.default),
  { ssr: false }
);

const HabitsModeEditor = dynamic(
  () => import("../mode/habits").then((mod) => mod.default),
  { ssr: false }
);

export default function Write() {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();

  const [_, setStatusBar, resetStatusBar] = useStatusBar();
  const { dataNote, setDataNote, updateMutate } = React.useContext(
    WriteContext
  ) as WriteContextType;
  const {
    generateChangesId,
    note: { changesRandomId },
  } = React.useContext(NoteContext) as NoteContextType;
  const saveBtnRef = React.useRef<HTMLButtonElement>(null);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const { allProcess } = useProcess();
  const currentProcess = allProcess?.find((process) => process.id === id);

  const noteDetailQuery = useMutation(
    ["get-note", id],
    async () => {
      return (await noteService.getOneNote(id as string)).data.data;
    },
    {
      onSuccess(data) {
        if (!data) {
          router.back();
          return;
        }
        setTodos(data?.todos || []);
        setDataNote((prev) => ({
          ...prev,
          isSecure: data?.isSecure,
          tags: data?.tags,
          title: data?.title,
          files: data?.filesUrl?.map((fl) => ({ ...fl, id: uuid() })),
          images: data?.imagesUrl?.map((img) => ({ ...img, id: uuid() })),
          modeWrite: data?.type || "freetext",
          scheduler:
            data?.type === "habits"
              ? ({
                  type: data?.schedulerType,
                  days: data?.schedulerDays,
                  startTime: data?.schedulerStartTime,
                  endTime: data?.schedulerEndTime,
                } as WriteStateType["scheduler"])
              : undefined,
        }));
      },
    }
  );

  const isSecureNoteQuery = useQuery(
    [noteService.isSecureNote.name, id],
    async () => {
      return (await noteService.isSecureNote(id as string)).data.data;
    },
    {
      enabled: !!id,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        if (!data) {
          noteDetailQuery.mutate();
        }
        setDataNote((prev) => ({
          ...prev,
          authorized: !data,
        }));
      },
    }
  );

  useBridgeEvent(ON_UPDATE_SUCCESS, (payload: { processId: string }) => {
    generateChangesId();
    if (pathname.includes("/write") && payload.processId === id) {
      window.dispatchEvent(
        new CustomEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + "button-save-write")
      );
      noteDetailQuery.mutate();
    }
  });

  const saveWrite = async (restData: any) => {
    let data = {
      title: dataNote?.title,
      type: dataNote.modeWrite,
      isSecure: dataNote?.isSecure,
      tags: dataNote?.tags,
      images: dataNote?.images?.map((img) => ({
        base64: img?.base64,
        contentType: img?.contentType,
        name: img?.name,
        sizeInMb: img?.sizeInMb,
        url: img?.url,
      })),
      files: dataNote?.files?.map((file) => ({
        base64: file?.base64,
        contentType: file?.contentType,
        name: file?.name,
        sizeInMb: file?.sizeInMb,
        url: file?.url,
      })),
      ...restData,
    } as CreateNote;

    try {
      resetStatusBar();
      validation(noteValidation.CREATE, data as any);
      updateMutate.mutateAsync({ note: data as CreateNote, id: id as string });
    } catch (e: any) {
      setStatusBar({
        type: "danger",
        show: true,
        message: e?.message,
      });
    }
  };

  const onChangeTitle = (e: any) => {
    const text = e.target.value;
    setDataNote((prev) => ({
      ...prev,
      title: text,
    }));
  };

  const onClickBack = () => {
    router.back();
  };

  const onSaveClick = () => {
    if (!saveBtnRef.current) return;
    saveBtnRef.current.click();
  };

  const excludeTools = () => {
    let excludesSetting = ["folder", "mode"];
    if (
      noteDetailQuery.data?.type === "habits" ||
      dataNote?.modeWrite === "habits"
    ) {
      excludesSetting = [...excludesSetting, "secure", "collabs"];
    }
    if (noteDetailQuery.data?.isSecure || dataNote?.isSecure) {
      excludesSetting.push("collabs");
    }
    if (noteDetailQuery.data?.role === "editor") {
      excludesSetting = [
        ...excludesSetting,
        "delete",
        "secure",
        "collabs",
        "tag",
      ] as ToolsType[];
    }

    return excludesSetting as ToolsType[];
  };

  const asViewer = noteDetailQuery.data?.role === "viewer";
  const isOwner = !noteDetailQuery.data?.role;
  const isSecure = isSecureNoteQuery.data && !dataNote?.authorized;

  return (
    <>
      <div className="container-custom pb-20 min-h-screen bg-white relative">
        <div className="flex flex-row items-center flex-1 sticky top-0 left-0 py-1 bg-white z-20">
          <div className="mr-3">
            <Button
              onClick={onClickBack}
              title="Back"
              size="icon"
              variant="ghost"
              className="!w-10"
            >
              <ChevronLeft />
            </Button>
          </div>
          <TopToolBar />
        </div>
        {noteDetailQuery.data?.folderName && isOwner && (
          <Breadcrumb>
            <BreadcrumbList>
              <FolderOpen size={18} />
              <BreadcrumbItem>
                <Link
                  href={`/folder/${noteDetailQuery.data?.folderId}`}
                  passHref
                >
                  <BreadcrumbLink>
                    {noteDetailQuery.data?.folderName}
                  </BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <StateRender
          data={noteDetailQuery.data || isSecureNoteQuery.data}
          isLoading={noteDetailQuery.isLoading || isSecureNoteQuery.isLoading}
          isError={noteDetailQuery.isError || isSecureNoteQuery?.isError}
        >
          <StateRender.Data>
            {isSecure ? (
              <div className="flex items-center min-h-[400px] w-full">
                <OpenSecureNote refetch={noteDetailQuery.mutate} />
              </div>
            ) : (
              <div className="w-full container-read overflow-x-hidden lg:!px-10 mt-10">
                <input
                  disabled={asViewer}
                  value={dataNote?.title}
                  onChange={onChangeTitle}
                  autoFocus={true}
                  type="text"
                  placeholder="Title ..."
                  className="text-2xl w-full font-medium border-none focus:outline-none outline-none bg-transparent mb-5"
                />
                {dataNote.tags?.length ? (
                  <div className="">
                    <p className="text-xs text-gray-400 font-light mb-2 w-fit">
                      Tags
                    </p>
                    {isOwner ? (
                      <ShowedTags className="my-5 sm:!flex-wrap" />
                    ) : (
                      <div className="my-4">
                        <ResponsiveTagsListed
                          tags={noteDetailQuery.data?.tags}
                          size={16}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
                {dataNote.modeWrite === "freetext" && (
                  <FreetextModeEditor
                    key={changesRandomId}
                    showInfoDefault={false}
                    options={{ readOnly: asViewer }}
                    data={noteDetailQuery.data?.note}
                    asEdit
                    onSave={saveWrite}
                  >
                    <button ref={saveBtnRef} type="submit">
                      submit
                    </button>
                  </FreetextModeEditor>
                )}
                {dataNote.modeWrite === "todolist" &&
                  (asViewer ? (
                    <TodoListModeEditor.AsView todos={todos} />
                  ) : (
                    <TodoListModeEditor
                      asEdit
                      showInfoDefault={false}
                      defaultTodos={todos}
                      todos={todos}
                      onSave={saveWrite}
                    >
                      <button ref={saveBtnRef} type="submit">
                        submit
                      </button>
                    </TodoListModeEditor>
                  ))}
                {dataNote.modeWrite === "habits" && isOwner && (
                  <HabitsModeEditor
                    showInfoDefault={false}
                    note={noteDetailQuery.data}
                    asEdit
                    onSave={saveWrite}
                  >
                    <button ref={saveBtnRef} type="submit">
                      submit
                    </button>
                  </HabitsModeEditor>
                )}
                <CollabsList noteId={id as string}>
                  {(list) => {
                    if (isOwner && !list?.length) return null;
                    return (
                      <span className="caption my-10 block">
                        {`Edited ${formatDate(
                          noteDetailQuery.data?.updatedAt
                        )} By `}
                        <span className="font-semibold">
                          {noteDetailQuery.data?.updatedBy}
                        </span>
                      </span>
                    );
                  }}
                </CollabsList>
                <div className="h-6"></div>
                <ListImage canEdit />
                <div className="h-6"></div>
                <ListFile canEdit />
              </div>
            )}
          </StateRender.Data>
          <StateRender.Loading>
            <div className="container-read">
              <Skeleton className="w-[300px] h-[50px]" />
              <Skeleton className="w-[350px] h-[20px] mt-6" />
              <Skeleton className="w-[200px] h-[20px] mt-3" />
            </div>
          </StateRender.Loading>
          <StateRender.Error>
            <p className="text-red-500">
              {(noteDetailQuery.error as Error)?.message}
            </p>
          </StateRender.Error>
        </StateRender>
      </div>
      {!noteDetailQuery?.isLoading &&
        noteDetailQuery.data?.role !== "viewer" &&
        !isSecure &&
        !noteDetailQuery.isError && (
          <div className="flex justify-center fixed sm:absolute z-40 sm:bottom-2 bottom-0 left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-full sm:w-fit sm:bg-white sm:rounded-full sm:shadow-xl">
            <ToolsBar
              currentNote={noteDetailQuery.data}
              excludeSettings={excludeTools()}
              isLoading={currentProcess?.type === "progress"}
              save={onSaveClick}
            />
          </div>
        )}
    </>
  );
}
