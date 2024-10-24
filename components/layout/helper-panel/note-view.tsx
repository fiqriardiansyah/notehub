"use client";

import TodoListModeEditor, { Todo } from "@/app/write/mode/todolist";
import CollabsList from "@/components/common/collabs-list";
import OpenSecureNote from "@/components/open-secure-note";
import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonContext, CommonContextType } from "@/context/common";
import { fireBridgeEvent, useBridgeEvent } from "@/hooks/use-bridge-event";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { formatDate } from "@/lib/utils";
import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import * as lodash from "lodash";
import { PencilRuler, X } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";
import { HELPER_PANEL_EXIT, HELPER_PANEL_NOTE_VIEW } from ".";
import { NoteContext, NoteContextType } from "@/context/note";
import ListImage from "@/components/file/list-image";
import ListFile from "@/components/file/list-file";

const FreetextModeEditor = dynamic(
  () => import("@/app/write/mode/freetext").then((mod) => mod.default),
  { ssr: false }
);

export default function NoteViewPanel() {
  const { setCommon } = React.useContext(CommonContext) as CommonContextType;
  const {
    note: { changesRandomId },
  } = React.useContext(NoteContext) as NoteContextType;
  const router = useRouter();
  const pathname = usePathname();
  const [payload, setPayload] = React.useState<Note>();
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const blockHitApiRef = React.useRef(false);
  const buttonCloseRef = React.useRef<HTMLButtonElement>(null);
  const [isSecure, setIsSecure] = React.useState(false);
  const havePassSecure = React.useRef(false);

  const noteDetailMutate = useMutation(
    async (id: string) => {
      return (await noteService.getOneNote(id)).data.data;
    },
    {
      onSuccess(data) {
        setTodos(data?.todos || []);
        if (havePassSecure.current) return;
        setIsSecure(!!data?.isSecure);
      },
    }
  );

  const changeTodosMutate = useMutation(async (todos: Todo[]) => {
    return (await noteService.changeTodos({ noteId: payload!.id, todos })).data
      .data;
  });

  const isSecureNoteQuery = useMutation(
    [noteService.isSecureNote.name],
    async (id: string) => {
      return (await noteService.isSecureNote(id)).data.data;
    },
    {
      onSuccess(data, id) {
        if (!data) {
          noteDetailMutate.mutate(id);
        }
        setIsSecure(data);
      },
    }
  );

  const onChangeTodoList = (todo: Todo[]) => {
    setTodos(todo);
  };

  const openSecure = () => {
    setIsSecure(false);
    havePassSecure.current = true;
    noteDetailMutate.mutate(payload!.id);
  };

  useBridgeEvent("update_todos_to_panel_" + payload?.id, (tds: Todo[]) => {
    blockHitApiRef.current = true;
    setTodos(tds);
    const timeout = setTimeout(() => {
      blockHitApiRef.current = false;
      clearTimeout(timeout);
    }, 200);
  });

  useSkipFirstRender(() => {
    if (blockHitApiRef.current) return;
    if (lodash.isEqual(todos, noteDetailMutate.data?.todos)) return;
    fireBridgeEvent("update_todos_from_helper_panel" + payload?.id, todos);
    const update = setTimeout(() => {
      changeTodosMutate.mutateAsync(todos || []);
    }, 300);

    return () => clearTimeout(update);
  }, [todos]);

  useBridgeEvent(HELPER_PANEL_NOTE_VIEW, (note: Note) => {
    setPayload(note);
    isSecureNoteQuery.mutate(note.id);
  });

  React.useEffect(() => {
    if (!payload) return;
    noteDetailMutate.mutate(payload.id);
  }, [changesRandomId]);

  const onClickEdit = () => {
    fireBridgeEvent(HELPER_PANEL_EXIT, null);
    router.push(`/write/${payload?.id}`);
  };

  const onClickClose = () => {
    fireBridgeEvent(HELPER_PANEL_EXIT, null);
  };

  React.useEffect(() => {
    if (!payload) return;
    if (pathname.includes(payload?.id)) {
      setCommon((prev) => ({ ...prev, helperPanel: undefined }));
    }
  }, [pathname]);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { delay: 0.3 } }}
      className="w-full h-full flex flex-col overflow-y-auto pb-16"
    >
      <div className="w-full p-2 flex items-center sticky top-0 left-0 justify-between border-b z-30 bg-white border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={onClickEdit}
            title="Edit"
            size="icon-small"
            variant="ghost"
          >
            <PencilRuler size={15} />
          </Button>
          <CollabsList noteId={payload?.id} />
        </div>
        <Button
          ref={buttonCloseRef}
          onClick={onClickClose}
          title="close"
          size="icon-small"
          variant="ghost"
        >
          <X size={16} />
        </Button>
      </div>
      <div className="container-read flex flex-col w-full gap-6 py-4">
        <h1 className="capitalize">{payload?.title}</h1>
        <StateRender
          data={
            isSecureNoteQuery.data !== undefined ||
            isSecureNoteQuery.data !== null
          }
          isLoading={isSecureNoteQuery.isLoading}
          isError={(isSecureNoteQuery.error as Error)?.message}
        >
          <StateRender.Data>
            {isSecure ? (
              <OpenSecureNote refetch={openSecure} />
            ) : (
              <StateRender
                data={noteDetailMutate.data}
                isLoading={noteDetailMutate.isLoading}
                isError={noteDetailMutate.isError}
              >
                <StateRender.Data>
                  {noteDetailMutate.data?.type === "freetext" &&
                  noteDetailMutate.data.note?.blocks?.length ? (
                    <FreetextModeEditor
                      showInfoDefault={false}
                      data={noteDetailMutate.data?.note}
                      options={{ readOnly: true }}
                    />
                  ) : null}
                  {noteDetailMutate.data?.type === "todolist" && (
                    <TodoListModeEditor
                      showInfoDefault={false}
                      defaultTodos={todos}
                      todos={todos}
                      onChange={onChangeTodoList}
                    />
                  )}
                  {noteDetailMutate.data?.imagesUrl?.length ? (
                    <ListImage defaultList={noteDetailMutate.data?.imagesUrl} />
                  ) : null}
                  {noteDetailMutate.data?.filesUrl?.length ? (
                    <ListFile defaultList={noteDetailMutate.data?.filesUrl} />
                  ) : null}
                  <CollabsList noteId={noteDetailMutate.data?.id as string}>
                    {(list) => {
                      if (!list?.length) {
                        return (
                          <span className="caption my-10 block">
                            {`Last edit at ${formatDate(
                              noteDetailMutate.data?.updatedAt
                            )}`}
                          </span>
                        );
                      }
                      return (
                        <span className="caption my-10 block">
                          {`Edited ${formatDate(
                            noteDetailMutate.data?.updatedAt
                          )} By `}
                          <span className="font-semibold">
                            {noteDetailMutate.data?.updatedBy}
                          </span>
                        </span>
                      );
                    }}
                  </CollabsList>
                </StateRender.Data>
                <StateRender.Loading>
                  <div className="container-read flex flex-col gap-2">
                    <Skeleton className="w-[200px] h-[20px]" />
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[150px] h-[20px]" />
                  </div>
                </StateRender.Loading>
                <StateRender.Error>
                  <p className="text-red-500">
                    {(noteDetailMutate.error as Error)?.message}
                  </p>
                </StateRender.Error>
              </StateRender>
            )}
          </StateRender.Data>
          <StateRender.Loading>
            <div className="container-read flex flex-col gap-2">
              <Skeleton className="w-[200px] h-[20px]" />
              <Skeleton className="w-[250px] h-[20px]" />
              <Skeleton className="w-[150px] h-[20px]" />
            </div>
          </StateRender.Loading>
          <StateRender.Error>
            <p className="text-red-500">
              {(isSecureNoteQuery.error as Error)?.message}
            </p>
          </StateRender.Error>
        </StateRender>
      </div>
    </motion.div>
  );
}
