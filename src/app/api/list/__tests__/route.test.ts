/** @jest-environment node */
import { NextRequest } from "next/server";

// Supabase klientini chainable mock bilan almashtiramiz
const rangeMock = jest.fn();
const builder: any = {};
for (const m of ["select", "or", "eq", "overlaps", "order"]) {
  builder[m] = jest.fn(() => builder);
}
builder.range = rangeMock;

jest.mock("@/lib/supabase-server", () => ({
  isSupabaseConfigured: true,
  createSupabasePublic: () => ({ from: jest.fn(() => builder) }),
}));

import { GET } from "@/app/api/list/route";

const makeReq = (qs: string) =>
  new NextRequest(`http://localhost/api/list?${qs}`);

beforeEach(() => {
  jest.clearAllMocks();
  rangeMock.mockResolvedValue({ data: [{ id: "1" }], count: 42, error: null });
});

describe("GET /api/list", () => {
  it("rejects invalid type with 400", async () => {
    const res = await GET(makeReq("type=users"));
    expect(res.status).toBe(400);
  });

  it("returns items and total for a valid request", async () => {
    const res = await GET(makeReq("type=snippets&page=0"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual([{ id: "1" }]);
    expect(body.total).toBe(42);
    // 0-sahifa: range(0, 23)
    expect(rangeMock).toHaveBeenCalledWith(0, 23);
  });

  it("applies page offset to range", async () => {
    await GET(makeReq("type=prompts&page=2"));
    expect(rangeMock).toHaveBeenCalledWith(48, 71);
  });

  it("strips PostgREST grammar characters from q before or()", async () => {
    await GET(makeReq(`type=snippets&q=${encodeURIComponent("re,ac(t)*%")}`));
    const orArg = (builder.or as jest.Mock).mock.calls[0][0] as string;
    // Foydalanuvchi kiritmasidagi , ( ) * % \ belgilar olib tashlangan
    expect(orArg).toContain("%react%");
    expect(orArg).not.toContain("(");
    expect(orArg).not.toContain(")");
    expect(orArg).not.toContain("*");
  });

  it("filters snippets by language facet and prompts by category", async () => {
    await GET(makeReq("type=snippets&facet=TypeScript"));
    expect(builder.eq).toHaveBeenCalledWith("language", "TypeScript");

    jest.clearAllMocks();
    rangeMock.mockResolvedValue({ data: [], count: 0, error: null });
    await GET(makeReq("type=prompts&facet=Coding"));
    expect(builder.eq).toHaveBeenCalledWith("category", "Coding");
  });

  it("returns empty page instead of error on out-of-range (PGRST103)", async () => {
    rangeMock.mockResolvedValue({ data: null, count: 42, error: { code: "PGRST103", message: "range" } });
    const res = await GET(makeReq("type=snippets&page=99"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual([]);
  });
});
