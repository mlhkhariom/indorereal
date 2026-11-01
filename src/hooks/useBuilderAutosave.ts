import { useCallback, useEffect, useRef, useState } from "react";
import { AUTOSAVE_DELAY } from "@/lib/builder-editor";

/** Serialize writes and only acknowledge the exact snapshot the server accepted. */
export function useBuilderAutosave({ snapshot, initial, enabled, persist, recoveryKey }: {
  snapshot: string; initial: string; enabled: boolean;
  persist: (snapshot: string) => Promise<void>; recoveryKey: string;
}) {
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const latest = useRef(snapshot);
  const accepted = useRef(initial);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const alive = useRef(true);
  const persistRef = useRef(persist);
  latest.current = snapshot;
  persistRef.current = persist;
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) {
      const ok = await inFlight.current;
      if (!ok) return false;
      return latest.current === accepted.current ? true : save();
    }
    const value = latest.current;
    if (value === accepted.current) return true;
    setSaving(true);
    setError("");
    const task = (async () => {
      try {
        await persistRef.current(value);
        accepted.current = value;
        if (alive.current) { setSaved(value); setLastSaved(new Date()); }
        try { if (latest.current === value) sessionStorage.removeItem(recoveryKey); } catch { /* unavailable storage */ }
        return true;
      } catch (cause) {
        if (alive.current) setError(cause instanceof Error ? cause.message : "Could not save. Please retry.");
        return false;
      } finally {
        inFlight.current = null;
        if (alive.current) setSaving(false);
      }
    })();
    inFlight.current = task;
    return task;
  }, [recoveryKey]);

  const dirty = snapshot !== saved;
  useEffect(() => {
    if (dirty) {
      try { sessionStorage.setItem(recoveryKey, snapshot); } catch { /* saving still works */ }
    }
    if (!enabled || !dirty || error || saving) return;
    const timer = window.setTimeout(() => { void save(); }, AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [snapshot, enabled, dirty, error, saving, recoveryKey, save]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (latest.current !== accepted.current) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  return { dirty, saving, error, lastSaved, save };
}