import { withoutSignPath } from "@/lib/utils";
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

  React.useEffect(() => {
    if (note?.note) return;

    const timeout = setTimeout(() => {
      document.body.style.pointerEvents = '';
    }, 300);

    return () => {
      clearTimeout(timeout);
    }
  }, [note?.note]);

  const notesQuery = useQuery([noteService.getNote.name, "note-provider"], async () => {
    return (await noteService.getNote()).data.data;
  }, {
    enabled: !withoutSignPath.test(pathname)
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
    notes, note, setNote, setPickedNotes,
    generateChangesId,
  }),
    [notesQuery, toggleNote, pickedNotes, notes, note]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
