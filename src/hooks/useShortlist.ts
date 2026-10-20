import { useEffect, useState, useCallback } from "react";

const EVT = "shortlist-change";
const read = (key: string): string[] => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
};

/** Device-saved list of property ids (wishlist / compare). */
const useStoredList = (key: string, max?: number) => {
  const [ids, setIds] = useState<string[]>(() => read(key));
  useEffect(() => {
    const sync = () => setIds(read(key));
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, [key]);
  const save = (next: string[]) => { localStorage.setItem(key, JSON.stringify(next)); window.dispatchEvent(new Event(EVT)); };
  const toggle = useCallback((id: string) => {
    const cur = read(key);
    if (cur.includes(id)) { save(cur.filter((x) => x !== id)); return true; }
    if (max && cur.length >= max) return false;
    save([...cur, id]); return true;
  }, [key, max]);
  const clear = () => save([]);
  return { ids, has: (id: string) => ids.includes(id), toggle, clear };
};

export const COMPARE_MAX = 3;
export const useWishlist = () => useStoredList("ir_wishlist");
export const useCompare = () => useStoredList("ir_compare", COMPARE_MAX);
