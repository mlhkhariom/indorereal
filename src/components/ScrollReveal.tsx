interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

/**
 * Content is always visible immediately (no JS, no hidden-until-scrolled).
 * Browsers that support scroll-driven CSS animations get a light lift-in effect.
 */
const ScrollReveal = ({ children, className = "" }: ScrollRevealProps) => (
  <div className={`reveal ${className}`}>{children}</div>
);

export default ScrollReveal;
