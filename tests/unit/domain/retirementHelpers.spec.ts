import { describe, expect, it } from "vitest";
import { RetirementHelpers } from "@/domain/retirement/RetirementDomainAdapter";

describe("RetirementHelpers.suggestWithdrawalOrder", () => {
  it("prioritises non-registered and REER before CELI by default", () => {
    const order = RetirementHelpers.suggestWithdrawalOrder({
      assets: {
        celi: 20000,
        reer: 150000,
        nonRegistered: 50000
      }
    });

    expect(order[0]).toBe("NON_ENREGISTRE");
    expect(order[1]).toBe("REER");
    expect(order.includes("CELI")).toBe(true);
  });

  it("appends RRIF when detected in payload", () => {
    const order = RetirementHelpers.suggestWithdrawalOrder({
      accounts: [{ type: "ferr", balance: 80000 }]
    });

    expect(order).toContain("RRIF");
    expect(order.indexOf("RRIF")).toBeGreaterThan(0);
  });
});
