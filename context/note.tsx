import { Note } from "@/models/note";
import React from "react";

export type NoteStateType = {
  note?: Note | null;
};

export type NoteContextType = {
  note: NoteStateType;
  setNote: React.Dispatch<React.SetStateAction<NoteStateType>>;
};

export const NoteContext = React.createContext({});

export const NoteProvider = ({ children }: { children: any }) => {
  const [note, setNote] = React.useState<NoteStateType>();

  const value = {
    note,
    setNote,
  } as NoteContextType;

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
