import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackgroundBackupService } from "@/services/BackgroundBackupService";

type SpyInstance = ReturnType<typeof vi.spyOn>;

describe("BackgroundBackupService scheduling", () => {
  let setIntervalSpy: SpyInstance;
  let clearIntervalSpy: SpyInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
    localStorage.clear();
  });

  it("starts a loop with the provided frequency", () => {
    BackgroundBackupService.startLoop(5);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    const delay = setIntervalSpy.mock.calls[0]?.[1] as number;
    expect(delay).toBe(5 * 60_000);
    vi.advanceTimersByTime(5 * 60_000);
    expect(clearIntervalSpy).not.toHaveBeenCalled();
  });

  it("stops previous loop before starting a new one", () => {
    BackgroundBackupService.startLoop(10);
    BackgroundBackupService.startLoop(1);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("persists config updates and toggles auto-backup", () => {
    const stopSpy = vi.spyOn(BackgroundBackupService, "stopLoop");
    const startSpy = vi.spyOn(BackgroundBackupService, "startLoop");

    BackgroundBackupService.updateConfig({ enableAutoBackup: false });
    expect(stopSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem("mpr-backup-config") || "{}"))
      .toMatchObject({ enableAutoBackup: false });

    BackgroundBackupService.updateConfig({ enableAutoBackup: true, frequencyMin: 2 });
    expect(startSpy).toHaveBeenCalledWith(2);

    stopSpy.mockRestore();
    startSpy.mockRestore();
  });
});
