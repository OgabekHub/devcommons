/** @jest-environment node */
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Upstash env sozlanmagan — in-memory yo'l testlanadi

describe("checkRateLimit (in-memory)", () => {
  it("limits after maxRequests within the window", async () => {
    const opts = { maxRequests: 3, windowSeconds: 60 };
    const id = "user-limit-test";

    const r1 = await checkRateLimit(id, "t1", opts);
    const r2 = await checkRateLimit(id, "t1", opts);
    const r3 = await checkRateLimit(id, "t1", opts);
    const r4 = await checkRateLimit(id, "t1", opts);

    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it("keeps separate counters per prefix and identifier", async () => {
    const opts = { maxRequests: 1, windowSeconds: 60 };

    const a = await checkRateLimit("same-id", "prefix-a", opts);
    const b = await checkRateLimit("same-id", "prefix-b", opts);
    const c = await checkRateLimit("other-id", "prefix-a", opts);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(c.allowed).toBe(true);
  });

  it("resets after the window passes", async () => {
    jest.useFakeTimers();
    try {
      const opts = { maxRequests: 1, windowSeconds: 10 };
      const id = "window-reset-test";

      const first = await checkRateLimit(id, "t2", opts);
      const blocked = await checkRateLimit(id, "t2", opts);
      expect(first.allowed).toBe(true);
      expect(blocked.allowed).toBe(false);

      jest.advanceTimersByTime(11_000);

      const afterWindow = await checkRateLimit(id, "t2", opts);
      expect(afterWindow.allowed).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("getClientIp", () => {
  const makeReq = (forwarded: string | null) =>
    ({ headers: { get: () => forwarded } }) as unknown as Request;

  it("returns the LAST ip from x-forwarded-for (spoofga chidamli)", () => {
    expect(getClientIp(makeReq("1.1.1.1, 2.2.2.2, 3.3.3.3"))).toBe("3.3.3.3");
  });

  it("returns unknown when the header is missing", () => {
    expect(getClientIp(makeReq(null))).toBe("unknown");
  });
});
