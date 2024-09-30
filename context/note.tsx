import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";
import { v4 as uuid } from "uuid";

export type NoteStateType = {
  note?: Note | null;
  changesRandomId?: string;
};

export type NoteContextType = {
  note: NoteStateType;
  setNote: React.Dispatch<React.SetStateAction<NoteStateType>>;
  notesQuery: UseQueryResult<Note[], unknown>;
  toggleNote: (note: Note) => void;
  pickedNotes: Note[];
  resetPickedNotes: () => void;
  hideNotes: (notes: Note[]) => void;
  notes?: Note[];
  setPickedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onClickPick: (callback: (data: { notes: Note[], resetPickedNotes: () => void, payload: any }) => void) => void;
  triggerClickPick: (payload: any) => void;
  emptyCallback: () => void;
  generateChangesId: () => void;
};

export const NoteContext = React.createContext({});

export const NoteProvider = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const [note, setNote] = React.useState<NoteStateType>({
    changesRandomId: ""
  });
  const [pickedNotes, setPickedNotes] = React.useState<Note[]>([]);
  const [tempHideNotes, setTempHideNotes] = React.useState<string[]>([]);

  const notesQuery = useQuery([noteService.getNote.name, "note-provider"], async () => {
    return (await noteService.getNote()).data.data;
  }, {
    enabled: !pathname.includes("/signin")
  });

  const toggleNote = React.useCallback((note: Note) => {
    if (!notesQuery.data?.find((n) => n.id === note.id)) return;
    setPickedNotes((prev) => {
      if (prev.find((n) => n.id === note.id)) {
        return prev?.filter((n) => n.id !== note.id);
      }
      return [...prev, note];
    });
  }, [notesQuery.data]);

  const resetPickedNotes = () => {
    setPickedNotes([]);
  }

  const hideNotes = (notes: Pick<Note, "id">[]) => {
    setTempHideNotes(notes.map((n) => n.id));
  }

  let onClickPickCallback: any[] = [];

  const onClickPick: NoteContextType["onClickPick"] = (callback) => {
    onClickPickCallback.push(callback);
  };

  const triggerClickPick = (payload: any) => {
    if (onClickPickCallback.length > 0) {
      onClickPickCallback.forEach((callback) => {
        callback({ notes: pickedNotes, resetPickedNotes, ...payload });
      });
    } else {
      console.log("No callback registered!");
    }
  }

  const emptyCallback = () => {
    onClickPickCallback = [];
  }

  const notes = notesQuery.data?.filter((n) => !tempHideNotes.find((id) => id === n.id));

  const generateChangesId = () => {
    setNote((prev) => ({
      ...prev,
      changesRandomId: uuid()
    }))
  }

  const value = React.useMemo(() =>
  ({
    notesQuery, toggleNote, pickedNotes, resetPickedNotes, hideNotes,
    notes, note, setNote, setPickedNotes, onClickPick, triggerClickPick, emptyCallback,
    generateChangesId,
  }),
    [notesQuery, toggleNote, pickedNotes, notes, note]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
