/** @jest-environment node */
import { NextRequest } from "next/server";

// Auth holatini har testda boshqarish uchun mutable mock
const getUserMock = jest.fn();
const maybeSingleMock = jest.fn();

const voteBuilder: any = {};
for (const m of ["select", "eq"]) {
  voteBuilder[m] = jest.fn(() => voteBuilder);
}
voteBuilder.maybeSingle = maybeSingleMock;

jest.mock("@/lib/supabase-server", () => ({
  createSupabaseServer: () => ({
    auth: { getUser: getUserMock },
    from: jest.fn(() => voteBuilder),
  }),
}));

import { GET } from "@/app/api/vote/route";

const makeReq = (qs: string) => new NextRequest(`http://localhost/api/vote?${qs}`);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/vote", () => {
  it("rejects missing/invalid params with 400", async () => {
    const res = await GET(makeReq("id=abc"));
    expect(res.status).toBe(400);

    const res2 = await GET(makeReq("id=abc&type=team"));
    expect(res2.status).toBe(400);
  });

  it("returns voted:false for anonymous users without querying votes", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    const res = await GET(makeReq("id=abc&type=snippet"));
    const body = await res.json();
    expect(body.voted).toBe(false);
    expect(maybeSingleMock).not.toHaveBeenCalled();
  });

  it("returns voted:true when a vote record exists", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    maybeSingleMock.mockResolvedValue({ data: { id: "vote-1" } });
    const res = await GET(makeReq("id=abc&type=snippet"));
    const body = await res.json();
    expect(body.voted).toBe(true);
  });

  it("returns voted:false when no vote record exists", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    maybeSingleMock.mockResolvedValue({ data: null });
    const res = await GET(makeReq("id=abc&type=prompt"));
    const body = await res.json();
    expect(body.voted).toBe(false);
  });
});
