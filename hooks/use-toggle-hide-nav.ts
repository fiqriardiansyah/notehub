import React from "react";

const SCROLL_HIDE_NAV = 30;

export default function useToggleHideNav() {

    const [isNavHide, setIsNavHide] = React.useState(false);
    const prevScroll = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            if (prevScroll.current === undefined || prevScroll.current === null) {
                prevScroll.current = window.scrollY;
                return;
            }

            if (window.scrollY > prevScroll.current && window.scrollY > SCROLL_HIDE_NAV && !isNavHide) {
                setIsNavHide(true);
            }

            if (window.scrollY < prevScroll.current - SCROLL_HIDE_NAV && isNavHide) {
                setIsNavHide(false);
            }

            prevScroll.current = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isNavHide]);

    return isNavHide
}