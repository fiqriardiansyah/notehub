"use client";

import MouseTrap from "mousetrap";

class ShortCut {
  mouseTrap?: typeof MouseTrap | null = null;
  constructor() {
    if (typeof window !== null || typeof window !== undefined) {
      this.mouseTrap = MouseTrap;
    }
  }

  logoutKey = "ctrl+shift+q";
  logout(callback: (str?: string) => void) {
    if (!this.mouseTrap?.bind) return;
    this.mouseTrap.bind(this.logoutKey, () => callback(this.logoutKey));
  }

  saveWriteKey = "ctrl+shift+s";
  saveWrite(callback: (str?: string) => void) {
    if (!this.mouseTrap?.bind) return;
    this.mouseTrap.bind(this.saveWriteKey, () => callback(this.saveWriteKey));
  }
}

export const shortCut = new ShortCut();
