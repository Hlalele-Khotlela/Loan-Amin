// utils/revolving.test.ts
import { checkRevolvingEligibility, RevolvingResult } from "../revolving";
import { Prisma } from "@prisma/client";

describe("checkRevolvingEligibility", () => {
  const limits = {
    shortTermLimit: 1000,
    EmergencyLimit: 500,
    longTermLimit: 2000,
  };

  it("should return ineligible if loan is not active", () => {
    const loan = { loan_type: "SHORT_TERM", Principal: 1000, instalments: 200, status: "closed" };
    const result = checkRevolvingEligibility(loan, limits);
    expect(result).toEqual({ eligible: false, reason: "Loan is not active (status: closed)" });
  });

  describe("LONG_TERM loans", () => {
    it("should be eligible if at least 30% repaid", () => {
      const loan = { loan_type: "LONG_TERM", Principal: 1000, instalments: 400, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result.eligible).toBe(true);
      expect(result.maxRevolvingAmount).toBeGreaterThanOrEqual(0);
    });

    it("should be ineligible if less than 30% repaid", () => {
      const loan = { loan_type: "LONG_TERM", Principal: 1000, instalments: 200, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result).toEqual({ eligible: false, reason: "Less than 30% of principal repaid for long-term loan" });
    });

    it("should be ineligible if longTermLimit is not defined", () => {
      const loan = { loan_type: "LONG_TERM", Principal: 1000, instalments: 400, status: "active" };
      const result = checkRevolvingEligibility(loan, { shortTermLimit: 1000, EmergencyLimit: 500 });
      expect(result).toEqual({ eligible: false, reason: "Long-term limit not defined" });
    });
  });

  describe("EMERGENCY loans", () => {
    it("should be eligible if balance is below emergency limit", () => {
      const loan = { loan_type: "EMERGENCY", Principal: 500, instalments: 100, balance: 200, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result.eligible).toBe(true);
      expect(result.maxRevolvingAmount).toBe(300); // 500 - 200
    });

    it("should be ineligible if balance exceeds emergency limit", () => {
      const loan = { loan_type: "EMERGENCY", Principal: 500, instalments: 100, balance: 600, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result).toEqual({ eligible: false, reason: "Remaining balance exceeds emergency limit" });
    });
  });

  describe("SHORT_TERM loans", () => {
    it("should be eligible if balance is below short-term limit", () => {
      const loan = { loan_type: "SHORT_TERM", Principal: 1000, instalments: 200, balance: 400, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result.eligible).toBe(true);
      expect(result.maxRevolvingAmount).toBe(600); // 1000 - 400
    });

    it("should be ineligible if balance exceeds short-term limit", () => {
      const loan = { loan_type: "SHORT_TERM", Principal: 1000, instalments: 200, balance: 1200, status: "active" };
      const result = checkRevolvingEligibility(loan, limits);
      expect(result).toEqual({ eligible: false, reason: "Remaining balance exceeds short-term limit" });
    });
  });

  it("should return unknown loan type if type is invalid", () => {
    const loan = { loan_type: "OTHER", Principal: 1000, instalments: 200, status: "active" };
    const result = checkRevolvingEligibility(loan, limits);
    expect(result).toEqual({ eligible: false, reason: "Unknown loan type: OTHER" });
  });
});
