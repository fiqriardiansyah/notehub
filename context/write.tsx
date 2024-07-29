import { Tag } from "@/models/note";
import React from "react";

export type WriteStateType = {
  isSecure?: boolean;
  tags?: Tag[];
  title?: string;
};

export type WriteContextType = {
  dataNote: WriteStateType;
  setDataNote: React.Dispatch<React.SetStateAction<WriteStateType | undefined>>;
};

export const WriteContext = React.createContext({});

export const WriteProvider = ({ children }: { children: any }) => {
  const [dataNote, setDataNote] = React.useState<WriteStateType>();

  const value = {
    dataNote,
    setDataNote,
  };

  return (
    <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
  );
};
