import reducer, { setSelectedCity, setPageNo } from "../../features/citySlice";

describe("citySlice reducer", () => {
  const initialState = {
    selectedCity: { name: "Hyderabad", lat: 17.385044, lng: 78.486671 },
    pageNo: 0,
  };

  it("should return the initial state when passed an empty action", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle setSelectedCity", () => {
    const newCity = { name: "Bangalore", lat: 12.9716, lng: 77.5946 };
    const action = setSelectedCity(newCity);
    const state = reducer(initialState, action);

    expect(state.selectedCity).toEqual(newCity);
    expect(state.pageNo).toBe(0); // reset page
  });

  it("should handle setPageNo", () => {
    const action = setPageNo(3);
    const state = reducer(initialState, action);

    expect(state.pageNo).toBe(3);
    expect(state.selectedCity).toEqual(initialState.selectedCity); // unchanged
  });
});
