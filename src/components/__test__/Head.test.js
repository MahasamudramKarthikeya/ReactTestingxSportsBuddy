import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store"; // mock redux store

import Head from "../Head"; // Adjust the import path as necessary

const mockStore = configureStore([]);

describe("Head component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      city: {
        selectedCity: { name: "Hyderabad" },
      },
    });
  });

  test("renders logo, nav links, and city selector", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Head />
        </MemoryRouter>
      </Provider>
    );

    // Logo check
    expect(screen.getByAltText("Logo")).toBeInTheDocument();

    // Nav links check
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();

    // City selector: multiple elements have title 'Hyderabad', so check all and expect at least one
    const citySelectorSections = screen.getAllByTitle("Hyderabad");
    expect(citySelectorSections.length).toBeGreaterThan(0);
  });

  test("toggles mobile menu on hamburger click", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Head />
        </MemoryRouter>
      </Provider>
    );

    const hamburger = screen.getByRole("button", { name: "☰" });

    // Initially menu should not have "open" class
    const rightSection = document.querySelector(".right-section");
    expect(rightSection.classList.contains("open")).toBe(false);

    // Click hamburger to open menu
    fireEvent.click(hamburger);
    expect(rightSection.classList.contains("open")).toBe(true);

    // Click hamburger again to close menu
    fireEvent.click(hamburger);
    expect(rightSection.classList.contains("open")).toBe(false);
  });
});
