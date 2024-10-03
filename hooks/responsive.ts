"use client";

import { useMediaQuery } from "react-responsive";

export const useMobileMediaQuery = () => useMediaQuery({ query: '(max-width: 599px)' });

export const useTabletMediaQuery = () => useMediaQuery({ query: '(min-width: 600px) and (max-width: 1023px)' });

export const useDesktopMediaQuery = () => useMediaQuery({ query: '(min-width: 1024px)' });