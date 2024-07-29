import React from "react";

export type CommonState = {
    statusBar?: {
        type?: "default" | "danger" | "success" | "loading";
        message?: string;
        show?: boolean;
    } | null;
    sidePageOpen?: boolean;
    groundOpen?: string;
};

export type CommonContextType = {
    common: CommonState;
    setCommon: React.Dispatch<React.SetStateAction<CommonState>>;
};

export const CommonContext = React.createContext({});

export const CommonProvider = ({ children }: { children: any }) => {
    const [common, setCommon] = React.useState<CommonState>();

    const value = {
        common,
        setCommon,
    } as CommonContextType;

    return (
        <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
    );
};
