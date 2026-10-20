/** First focusable element: lets keyboard users jump past the menu. */
const SkipLink = () => (
  <a
    href="#main"
    onClick={(e) => {
      const main = document.querySelector("main");
      if (!main) return;
      e.preventDefault();
      main.setAttribute("tabindex", "-1");
      main.focus();
    }}
    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-secondary focus:px-4 focus:py-2 focus:text-secondary-foreground focus:font-semibold"
  >
    Skip to main content
  </a>
);
export default SkipLink;
