import { renderHook, act, waitFor } from "@testing-library/react";
import useFetchVenues from "../../hooks/useFetchVenues";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  // Suppress React act() warnings
  jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
    if (
      typeof msg === "string" &&
      (msg.includes("not wrapped in act") ||
        msg.includes("Error fetching venues"))
    ) {
      return;
    }
    console.error(msg, ...args);
  });
});

afterAll(() => {
  console.error.mockRestore();
});

describe("useFetchVenues", () => {
  test("fetches and appends venues correctly", async () => {
    const fakeData = { data: { venueList: [{ name: "Venue 1" }] } };

    fetch.mockResolvedValueOnce({
      json: async () => fakeData,
    });

    const { result, rerender } = renderHook(
      ({ lat, lng, pageNo }) => useFetchVenues(lat, lng, pageNo),
      { initialProps: { lat: 10, lng: 20, pageNo: 0 } }
    );

    // Should start loading
    expect(result.current.loading).toBe(true);

    // Wait until loading becomes false
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.venueList).toEqual(fakeData.data.venueList);
    expect(result.current.hasMore).toBe(true);

    // Next page fetch
    fetch.mockResolvedValueOnce({
      json: async () => fakeData,
    });
    rerender({ lat: 10, lng: 20, pageNo: 1 });

    await waitFor(() => expect(result.current.venueList.length).toBe(2));
  });

  test("sets hasMore=false when no data returned", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ data: { venueList: [] } }),
    });

    const { result } = renderHook(() => useFetchVenues(10, 20, 0));

    await waitFor(() => expect(result.current.hasMore).toBe(false));
  });

  test("resets venueList when lat/lng change", async () => {
    fetch.mockResolvedValue({
      json: async () => ({ data: { venueList: [{ name: "Old Venue" }] } }),
    });

    const { result, rerender } = renderHook(
      ({ lat, lng }) => useFetchVenues(lat, lng, 0),
      { initialProps: { lat: 10, lng: 20 } }
    );

    await waitFor(() =>
      expect(result.current.venueList).toEqual([{ name: "Old Venue" }])
    );

    rerender({ lat: 99, lng: 88 });

    // Immediately resets to []
    expect(result.current.venueList).toEqual([]);
  });

  test("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchVenues(10, 20, 0));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });
});
