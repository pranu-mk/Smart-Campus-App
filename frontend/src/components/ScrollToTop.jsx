import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * This is a "logic-only" component. It doesn't show anything on the UI,
 * but it resets the scrollbar every time the URL changes.
 */
const ScrollToTop = () => {
  // 1. Get the current location object (which includes the pathname)
  const { pathname } = useLocation();

  useEffect(() => {
    // 2. This code runs every time the pathname changes
    // We tell the window to go back to the top-left corner
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // "instant" ensures the user doesn't see a "slide" up
    });
  }, [pathname]); // The "dependency array" tells React to watch the pathname

  // 3. We return null because this component doesn't need to render HTML
  return null;
};

export default ScrollToTop;