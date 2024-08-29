import { ModeNote, Tag } from "@/models/note";
import { usePathname } from "next/navigation";
import React from "react";

export type WriteStateType = {
  authorized?: boolean;
  isSecure?: boolean;
  tags?: Tag[];
  title?: string;
  folder?: {
    id?: string;
    name?: string;
  };
  modeWrite?: ModeNote;
  scheduler?: {
    type: "day" | "weekly" | "monthly",
    days?: string[];
    startTime?: string;
    endTime?: string;
  };
};

export type WriteContextType = {
  dataNote: WriteStateType;
  setDataNote: React.Dispatch<React.SetStateAction<WriteStateType | undefined>>;
};

export const WriteContext = React.createContext({});

export const WriteProvider = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const [dataNote, setDataNote] = React.useState<WriteStateType>({
    modeWrite: "freetext",
  });

  React.useEffect(() => {
    setDataNote((prev) => ({
      modeWrite: prev.modeWrite
    }));
  }, [pathname]);

  const value = {
    dataNote,
    setDataNote,
  };

  return (
    <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
  );
};
