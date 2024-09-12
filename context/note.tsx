import { Note } from "@/models/note";
import noteService from "@/service/note";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";

export type NoteStateType = {
  note?: Note | null;
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
};

export const NoteContext = React.createContext({});

export const NoteProvider = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const [note, setNote] = React.useState<NoteStateType>();
  const [pickedNotes, setPickedNotes] = React.useState<Note[]>([]);
  const [tempHideNotes, setTempHideNotes] = React.useState<Note[]>([]);

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

  const hideNotes = (notes: Note[]) => {
    setTempHideNotes(notes);
  }

  const notes = notesQuery.data?.filter((n) => !tempHideNotes.find((tn) => tn.id === n.id));

  const value = React.useMemo(() =>
    ({ notesQuery, toggleNote, pickedNotes, resetPickedNotes, hideNotes, notes, note, setNote, setPickedNotes }),
    [notesQuery, toggleNote, pickedNotes, notes, note]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
