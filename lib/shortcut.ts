"use client";

import MouseTrap from "mousetrap";

export class ShortCut {
  static logoutKey = "ctrl+shift+q";
  static saveWriteKey = "ctrl+shift+s";
  static searchKey = "ctrl+k";

  static shortcut(key: string = "", callback: (str: string) => void) {
    if (typeof window !== null || typeof window !== undefined) {
      MouseTrap.bind(key, () => callback(key));
    }
  }
}
