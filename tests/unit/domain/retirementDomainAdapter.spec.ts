import { describe, expect, it, vi } from "vitest";
import { RetirementHelpers } from "@/domain/retirement/RetirementDomainAdapter";

const SAMPLE_ORDER: ReturnType<typeof RetirementHelpers.suggestWithdrawalOrder> = [
  "NON_ENREGISTRE",
  "REER",
  "CELI"
];

describe("RetirementHelpers.buildMonthlySchedule", () => {
  it("returns a 12 month schedule with balanced weights for three sources", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

    const schedule = RetirementHelpers.buildMonthlySchedule("scenario-test", 3600, SAMPLE_ORDER);

    expect(schedule.scenarioId).toBe("scenario-test");
    expect(schedule.period).toBe("monthly");
    expect(schedule.entries.length).toBe(36);

    const firstMonth = schedule.entries.slice(0, 3);
    expect(firstMonth.map(entry => entry.gross)).toEqual([1200, 1200, 1200]);
    expect(firstMonth.map(entry => entry.net)).toEqual([1200, 1200, 1200]);

    const allocations = schedule.entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.source] = (acc[entry.source] ?? 0) + entry.gross;
      return acc;
    }, {});
    expect(Object.keys(allocations)).toEqual(["NON_ENREGISTRE", "REER", "CELI"]);
    expect(allocations.NON_ENREGISTRE).toBeCloseTo(14_400, 2);
    expect(allocations.REER).toBeCloseTo(14_400, 2);
    expect(allocations.CELI).toBeCloseTo(14_400, 2);

    vi.useRealTimers();
  });

  it("returns empty entries when need is zero", () => {
    const schedule = RetirementHelpers.buildMonthlySchedule("scenario-empty", 0, SAMPLE_ORDER);
    expect(schedule.entries).toHaveLength(0);
  });
});
