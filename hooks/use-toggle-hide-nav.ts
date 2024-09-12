import React from "react";

const SCROLL_HIDE_NAV = 30;

export default function useToggleHideNav() {

    const [isNavHide, setIsNavHide] = React.useState(false);

    React.useEffect(() => {
        let lastScrollY = window.scrollY;
        let scrollUpDistance = 0; // Track the total distance scrolled up

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Scrolling down
            if (currentScrollY > lastScrollY && !isNavHide) {
                setIsNavHide(true);
                scrollUpDistance = 0; // Reset scroll-up distance when scrolling down
            }

            // Scrolling up
            if (currentScrollY < lastScrollY) {
                scrollUpDistance += lastScrollY - currentScrollY; // Accumulate scroll-up distance

                if (scrollUpDistance > SCROLL_HIDE_NAV && isNavHide) {
                    setIsNavHide(false);
                    scrollUpDistance = 0; // Reset scroll-up distance after showing the navbar
                }

                if (currentScrollY < 10) {
                    setIsNavHide(false);
                }
            }

            lastScrollY = currentScrollY; // Update last scroll position
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isNavHide]);


    return isNavHide
}