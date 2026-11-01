import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBuilderAutosave } from "@/hooks/useBuilderAutosave";
import { AUTOSAVE_DELAY } from "@/lib/builder-editor";

describe("builder automatic saving", () => {
  beforeEach(() => { vi.useFakeTimers(); sessionStorage.clear(); });
  afterEach(() => { vi.useRealTimers(); });
  it("auto-saves edits after the debounce and clears recovery after acceptance", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const { result, rerender } = renderHook(({snapshot}) => useBuilderAutosave({snapshot, initial: "initial", enabled: true, persist, recoveryKey: "test-recovery"}), {initialProps: {snapshot: "initial"}});
    rerender({snapshot: "changed"});
    expect(sessionStorage.getItem("test-recovery")).toBe("changed");
    await act(async () => { await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY); });
    expect(persist).toHaveBeenCalledWith("changed");
    expect(result.current.dirty).toBe(false);
    expect(sessionStorage.getItem("test-recovery")).toBeNull();
  });
  it("never acknowledges edits made while an older save is running", async () => {
    let complete: (() => void) | undefined;
    const persist = vi.fn().mockImplementationOnce(() => new Promise<void>(resolve => {complete = resolve;})).mockResolvedValue(undefined);
    const {result, rerender} = renderHook(({snapshot}) => useBuilderAutosave({snapshot, initial: "initial", enabled: true, persist, recoveryKey: "test-recovery"}), {initialProps:{snapshot: "first"}});
    await act(async () => { await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY); });
    rerender({snapshot:"second"});
    await act(async () => {complete?.();});
    expect(result.current.dirty).toBe(true);
    expect(sessionStorage.getItem("test-recovery")).toBe("second");
    await act(async () => { await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY); });
    expect(persist.mock.calls.map(args => args[0])).toEqual(["first","second"]);
    expect(result.current.dirty).toBe(false);
  });
  it("leaves failed edits recoverable and supports retry", async () => {
    const persist=vi.fn().mockRejectedValueOnce(new Error("Offline")).mockResolvedValue(undefined);
    const {result}=renderHook(() => useBuilderAutosave({snapshot:"changed",initial:"initial",enabled:true,persist,recoveryKey:"test-recovery"}));
    await act(async () => { await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY); });
    expect(result.current.error).toBe("Offline"); expect(result.current.dirty).toBe(true);
    expect(sessionStorage.getItem("test-recovery")).toBe("changed");
    await act(async () => {await result.current.save();});
    expect(result.current.dirty).toBe(false); expect(result.current.error).toBe("");
  });
  it("does not auto-save when switched off", async () => {
    const persist=vi.fn().mockResolvedValue(undefined);
    const {result}=renderHook(() => useBuilderAutosave({snapshot:"changed",initial:"initial",enabled:false,persist,recoveryKey:"test-recovery"}));
    await act(async () => {await vi.advanceTimersByTimeAsync(5000);});
    expect(persist).not.toHaveBeenCalled();
    await act(async () => {await result.current.save();});
    expect(persist).toHaveBeenCalledWith("changed");
  });
});