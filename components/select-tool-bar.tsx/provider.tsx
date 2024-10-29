import { Folder, Note } from "@/models/note";
import React from "react";

export type SelectToolBarState = {
  selectedNotes: Note[];
};

export type SelectToolBarContextType = {
  selectToolbar: SelectToolBarState;
  setSelectToolbar: React.Dispatch<React.SetStateAction<SelectToolBarState | undefined>>;
  notes?: Note[];
};

export const SelectToolBarContext = React.createContext({});

export const SelectToolBarProvider = ({ children, notes }: { children: (value: SelectToolBarContextType) => any; notes?: Note[] }) => {
  const [selectToolbar, setSelectToolbar] = React.useState<SelectToolBarState>();

  const value = {
    selectToolbar,
    setSelectToolbar,
    notes,
  } as SelectToolBarContextType;

  return <SelectToolBarContext.Provider value={value}>{children(value)}</SelectToolBarContext.Provider>;
};

export const useSelectToolBar = () => {
  const context = React.useContext(SelectToolBarContext) as SelectToolBarContextType;

  const items = (context?.notes as (Note | Folder)[])?.filter((i) => i.type !== "folder") || [];
  const isSelectActive = !!context?.selectToolbar?.selectedNotes?.length;
  const isAllSelected = context?.selectToolbar?.selectedNotes?.length === items?.length;

  const emptiedSelectedNote = () => {
    context.setSelectToolbar((prev) => ({ ...prev, selectedNotes: [] }));
  };

  const toggleAllNote = () => {
    context.setSelectToolbar((prev) => ({
      ...prev,
      selectedNotes: prev?.selectedNotes?.length === items?.length ? [] : items,
    }));
  };

  const toggleSelectedNote = (note: Note) => {
    context.setSelectToolbar((prev) => ({
      ...prev,
      selectedNotes: prev?.selectedNotes?.find((n) => n.id === note.id)
        ? prev?.selectedNotes?.filter((n) => n.id !== note.id)
        : [...(prev?.selectedNotes || []), note],
    }));
  };

  if (!context) {
    throw new Error("useSelectToolBar must be used within a SelectToolBarProvider");
  }

  return {
    ...context,
    toggleSelectedNote,
    isSelectActive,
    toggleAllNote,
    isAllSelected,
    emptiedSelectedNote,
  };
};
