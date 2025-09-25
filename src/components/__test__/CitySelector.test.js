import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CitySelector from "../CitySelector"; // adjust path as necessary
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { setSelectedCity } from "../../features/citySlice";
import { cities } from "../../../utils/constants";

const mockStore = configureStore([]);

describe("CitySelector Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      city: {
        selectedCity: null,
      },
    });

    store.dispatch = jest.fn();
  });

  const renderWithProvider = (component) =>
    render(<Provider store={store}>{component}</Provider>);

  it("renders the component with placeholder", () => {
    renderWithProvider(<CitySelector />);
    expect(screen.getByText("Select a city...")).toBeInTheDocument();
  });

  it("displays the list of cities when clicked", async () => {
    renderWithProvider(<CitySelector />);

    const selectInput = screen.getByText("Select a city...");
    fireEvent.mouseDown(selectInput);

    await waitFor(() => {
      Object.keys(cities).forEach((cityName) => {
        expect(screen.getByText(cityName)).toBeInTheDocument();
      });
    });
  });

  it("dispatches setSelectedCity when a city is selected", async () => {
    renderWithProvider(<CitySelector />);

    const selectInput = screen.getByText("Select a city...");
    fireEvent.mouseDown(selectInput);

    const cityName = Object.keys(cities)[0];
    const cityOption = await screen.findByText(cityName);
    fireEvent.click(cityOption);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedCity({ name: cityName, ...cities[cityName] })
      );
    });
  });

  it("renders with selected city if already in store", () => {
    const selectedCityName = Object.keys(cities)[0];
    const selectedCity = {
      name: selectedCityName,
      ...cities[selectedCityName],
    };

    store = mockStore({
      city: {
        selectedCity,
      },
    });
    store.dispatch = jest.fn();

    renderWithProvider(<CitySelector />);

    expect(screen.getByText(selectedCityName)).toBeInTheDocument();
  });
});
