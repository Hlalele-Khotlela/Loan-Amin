import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { POST } from "@/app/api/Savings/[id]/withdrawal/route";
import { prisma } from "@/lib/prisma/prisma";

describe("Savings Withdrawal API", () => {
  let savingsId: number;

  beforeEach(async () => {
    const saving = await prisma.savings.create({
      data: {
        amount: 100,
        interest: 50,
        total: 150,
        min_amount: 10,
        savings_type: "COMPULSARY",
        member_Id: 2014002, // must exist in your DB
      },
    });
    savingsId = saving.savings_id;
  });

  afterEach(async () => {
    if (savingsId) {
      await prisma.savings.delete({ where: { savings_id: savingsId } });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("withdraws amount only", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: 30, interest: null }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.amount).toBe("70");
    expect(data.interest).toBe("50");
  });

  it("withdraws interest only", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: null, interest: 20 }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.amount).toBe("100");
    expect(data.interest).toBe("30");
  });

  it("withdraws both amount and interest", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: 10, interest: 10 }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.amount).toBe("90");
    expect(data.interest).toBe("40");
  });

  it("fails when amount exceeds balance", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: 9999, interest: null }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Insufficient principal balance");
  });

  it("fails when interest exceeds balance", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: null, interest: 9999 }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Insufficient interest balance");
  });

  it("fails when both are null", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: null, interest: null }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Either amount or interest must be provided");
  });

  it("fails when negative amount is provided", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: -10, interest: null }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Invalid withdrawal amount");
  });

  it("fails when negative interest is provided", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ amount: null, interest: -5 }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: savingsId.toString() }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Invalid interest amount");
  });
});
