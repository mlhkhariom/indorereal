import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top on page change (keeps #anchor jumps working). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
};
export default ScrollToTop;
