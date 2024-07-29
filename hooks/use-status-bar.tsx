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
      statusBar: null,
    }));
  };

  const setStatusBar = (val: CommonState["statusBar"]) => {
    setCommon((prev) => ({
      ...prev,
      statusBar: val,
    }));
  };

  return [common?.statusBar, setStatusBar, reset] as [
    CommonState["statusBar"],
    (val: CommonState["statusBar"]) => void,
    () => void
  ];
}
