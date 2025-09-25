import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Body from "../Body";
import useFetchVenues from "../../hooks/useFetchVenues";
import { setPageNo } from "../../features/citySlice";

// ✅ Mock custom hook
jest.mock("../../hooks/useFetchVenues");

// ✅ Mock react-redux
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const dispatchMock = jest.fn();

// ✅ Mock IntersectionObserver globally
let mockIntersectionObserverCallback;

beforeAll(() => {
  class MockIntersectionObserver {
    constructor(callback) {
      mockIntersectionObserverCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = MockIntersectionObserver;
});

describe("🧪 <Body /> Component", () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({
      city: {
        selectedCity: { lat: 12, lng: 77, name: "TestCity" },
        pageNo: 0,
      },
    });

    dispatchMock.mockClear();
    useDispatch.mockReturnValue(dispatchMock);

    // ✅ Simulate live Redux state
    useSelector.mockImplementation((selectorFn) =>
      selectorFn(store.getState())
    );

    useFetchVenues.mockReset();
  });

  test("renders fallback if no city selected", () => {
    // Override selector to simulate no city
    useSelector.mockImplementation((cb) =>
      cb({
        city: { selectedCity: null, pageNo: 0 },
      })
    );

    useFetchVenues.mockReturnValue({
      venueList: [],
      loading: false,
      hasMore: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Please select a city first/i)).toBeInTheDocument();
  });

  test("shows shimmer loader when loading is true", () => {
    useFetchVenues.mockReturnValue({
      venueList: [],
      loading: true,
      hasMore: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("shimmer-loader")).toBeInTheDocument();
  });

  test("renders venue cards from fetched list", () => {
    useFetchVenues.mockReturnValue({
      venueList: [
        { name: "Venue A", avgRating: 4.5, city: "Hyd", activeKey: "v1" },
        { name: "Venue B", avgRating: 3.8, city: "Hyd", activeKey: "v2" },
      ],
      loading: false,
      hasMore: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Venue A")).toBeInTheDocument();
    expect(screen.getByText("Venue B")).toBeInTheDocument();
  });

  test("filters venues using search input", () => {
    useFetchVenues.mockReturnValue({
      venueList: [
        { name: "Pizza Palace", avgRating: 4.5, city: "Hyd", activeKey: "v1" },
        { name: "Burger Barn", avgRating: 3.2, city: "Hyd", activeKey: "v2" },
      ],
      loading: false,
      hasMore: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/Search your fav venue/i);
    fireEvent.change(input, { target: { value: "pizza" } });

    expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
    expect(screen.queryByText("Burger Barn")).toBeNull();
  });

  test("toggles top-rated filter button correctly", () => {
    useFetchVenues.mockReturnValue({
      venueList: [
        { name: "Top Rated", avgRating: 5, city: "Hyd", activeKey: "v1" },
        { name: "Low Rated", avgRating: 3.2, city: "Hyd", activeKey: "v2" },
      ],
      loading: false,
      hasMore: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    const filterBtn = screen.getByRole("button", {
      name: /apply top rated filter/i,
    });

    fireEvent.click(filterBtn);
    expect(screen.getByText("Top Rated")).toBeInTheDocument();
    expect(screen.queryByText("Low Rated")).toBeNull();

    fireEvent.click(filterBtn);
    expect(screen.getByText("Low Rated")).toBeInTheDocument();
  });

  test("renders Load More button when 40 cards loaded and hasMore is true", () => {
    const dummyVenues = Array(40)
      .fill(null)
      .map((_, i) => ({
        name: `Venue ${i + 1}`,
        avgRating: 4,
        city: "Hyd",
        activeKey: `v${i + 1}`,
      }));

    useFetchVenues.mockReturnValue({
      venueList: dummyVenues,
      loading: false,
      hasMore: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /load more/i })
    ).toBeInTheDocument();
  });

  test("triggers infinite scroll and dispatches page increment once", async () => {
    const dummyVenues = Array(40)
      .fill(null)
      .map((_, i) => ({
        name: `Venue ${i + 1}`,
        avgRating: 4,
        city: "Hyd",
        activeKey: `v${i + 1}`,
      }));

    useSelector.mockImplementation((cb) =>
      cb({
        city: {
          selectedCity: { lat: 12, lng: 77, name: "TestCity" },
          pageNo: 0,
        },
      })
    );

    useFetchVenues.mockReturnValue({
      venueList: dummyVenues,
      loading: false,
      hasMore: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      mockIntersectionObserverCallback([{ isIntersecting: true }]);
    });

    // Check that setPageNo was called with 1 (scroll triggered)
    const wasPage1Called = dispatchMock.mock.calls.some(
      ([action]) => action.type === "city/setPageNo" && action.payload === 1
    );

    expect(wasPage1Called).toBe(true);
  });
});
