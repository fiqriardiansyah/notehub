import { usePathname } from "next/navigation";
import React from "react";

export type CommonState = {
    statusBar?: {
        type?: "default" | "danger" | "success" | "loading";
        message?: string;
        show?: boolean;
        icon?: any;
        autoClose?: number;
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
    const pathname = usePathname();
    const [common, setCommon] = React.useState<CommonState>();

    React.useEffect(() => {
        setCommon({});
    }, [pathname]);

    const value = {
        common,
        setCommon,
    } as CommonContextType;

    return (
        <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
    );
};
