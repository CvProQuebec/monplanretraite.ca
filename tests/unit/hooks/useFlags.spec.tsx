import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFlags } from "@/hooks/useFlags";

declare global {
  // eslint-disable-next-line no-var
  var __TEST_FLAGS__?: Record<string, boolean>;
}

beforeEach(() => {
  globalThis.__TEST_FLAGS__ = undefined;
});

afterEach(() => {
  globalThis.__TEST_FLAGS__ = undefined;
});

describe("useFlags", () => {
  it("memoizes the flags object", () => {
    const { result, rerender } = renderHook(() => useFlags());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("allows overrides through __TEST_FLAGS__ helper", () => {
    globalThis.__TEST_FLAGS__ = { VITE_SHOW_PLACEHOLDERS: true };
    const { result } = renderHook(() => useFlags());
    expect(result.current.SHOW_PLACEHOLDERS).toBe(true);
  });
});
