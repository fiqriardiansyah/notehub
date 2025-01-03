"use client";

import {
  CommonContext,
  CommonContextType,
  CommonState,
} from "@/context/common";
import React from "react";

export default function useStatusBar() {
  const { setCommon, common } = React.useContext(
    CommonContext
  ) as CommonContextType;

  const reset = () => {
    setCommon((prev) => ({
      ...prev,
      statusBar: undefined,
    }));
  };

  const setStatusBar = (val: CommonState["statusBar"]) => {
    setCommon((prev) => ({
      ...prev,
      statusBar: {
        ...val,
        show: !("show" in (val || {})) ? true : val?.show,
      },
    }));
  };

  return [common?.statusBar, setStatusBar, reset] as [
    CommonState["statusBar"],
    (val: CommonState["statusBar"]) => void,
    () => void
  ];
}
