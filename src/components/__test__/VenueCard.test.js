import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VenueCard from "../VenueCard";

const baseVenue = {
  name: "TRP (The Rooftop Pickle)",
  city: "Hyderabad",
  area: "LB Stadium Road",
  address: "LB Stadium Road",
  avgRating: 5,
  ratingCount: 7,
  coverImage:
    "https://playo.gumlet.io/THEROOFTOPPICKLE20250728164250075162/TheRooftopPickle1755319735294.jpg",
  images: [
    {
      url: "https://fallbackimage.com/fallback.jpg",
    },
  ],
  distance: 1.9,
  isBookable: true,
  isSafeHygiene: true,
  sports: ["SP83", "SP1", "SP2"],
};

describe("VenueCard - Full Coverage Tests", () => {
  it("displays location with area and distance correctly", () => {
    render(<VenueCard resData1={baseVenue} />);
    expect(
      screen.getByText(/LB Stadium Road \(1.90 Km\)/i)
    ).toBeInTheDocument();
  });

  it("renders fallback image from images if coverImage is missing", () => {
    const venue = {
      ...baseVenue,
      coverImage: "",
    };
    render(<VenueCard resData1={venue} />);
    const img = screen.getByAltText(baseVenue.name);
    expect(img).toHaveAttribute("src", baseVenue.images[0].url);
  });

  it("does NOT render image if both coverImage and images are missing", () => {
    const venue = {
      ...baseVenue,
      coverImage: "",
      images: [],
    };
    render(<VenueCard resData1={venue} />);
    const img = screen.queryByAltText(baseVenue.name);
    expect(img).not.toBeInTheDocument();
  });

  it("renders rating and votes correctly", () => {
    render(<VenueCard resData1={baseVenue} />);
    expect(screen.getByText("5.0")).toBeInTheDocument();
    expect(screen.getByText(/7 Votes/i)).toBeInTheDocument();
  });

  it("renders Bookable tag if isBookable is true", () => {
    render(<VenueCard resData1={baseVenue} />);
    expect(screen.getByText(/BOOKABLE/i)).toBeInTheDocument();
  });

  it("does NOT render Bookable tag if isBookable is false", () => {
    const venue = { ...baseVenue, isBookable: false };
    render(<VenueCard resData1={venue} />);
    expect(screen.queryByText(/BOOKABLE/i)).not.toBeInTheDocument();
  });

  it("renders Safe & Hygiene tag if avgRating > 4.5", () => {
    render(<VenueCard resData1={baseVenue} />);
    expect(screen.getByText(/Safe & Hygiene/i)).toBeInTheDocument();
  });

  it("does NOT render Safe & Hygiene tag if avgRating <= 4.5", () => {
    const venue = { ...baseVenue, avgRating: 4.5 };
    render(<VenueCard resData1={venue} />);
    expect(screen.queryByText(/Safe & Hygiene/i)).not.toBeInTheDocument();
  });

  it("renders sports icons and applies default icon on error", () => {
    render(<VenueCard resData1={baseVenue} />);
    const sportIcons = screen
      .getAllByRole("img")
      .filter((img) => img.classList.contains("sport-icon-img"));

    // trigger error on the first sport icon
    fireEvent.error(sportIcons[0]);

    expect(sportIcons[0]).toHaveAttribute(
      "src",
      "https://playo.gumlet.io/V3SPORTICONS/SP2.png?q=100"
    );
  });

  it("renders sports icons and applies default icon on error", () => {
    render(<VenueCard resData1={baseVenue} />);
    const sportIcons = screen
      .getAllByRole("img")
      .filter((img) => img.classList.contains("sport-icon-img"));

    // trigger error on the first sport icon
    fireEvent.error(sportIcons[0]);

    expect(sportIcons[0]).toHaveAttribute(
      "src",
      "https://playo.gumlet.io/V3SPORTICONS/SP2.png?q=100"
    );
  });

  it("renders 'N/A' for avgRating if missing", () => {
    const venue = { ...baseVenue, avgRating: null };
    render(<VenueCard resData1={venue} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders '0' votes if ratingCount is missing", () => {
    const venue = { ...baseVenue, ratingCount: null };
    render(<VenueCard resData1={venue} />);
    expect(screen.getByText(/0 Votes/i)).toBeInTheDocument();
  });

  it("renders 'Unknown' location if area and city missing", () => {
    const venue = { ...baseVenue, area: "", city: "" };
    render(<VenueCard resData1={venue} />);
    expect(screen.getByText(/Unknown \(1.90 Km\)/i)).toBeInTheDocument();
  });

  it("renders distance as 0 if missing", () => {
    const venue = { ...baseVenue, distance: null };
    render(<VenueCard resData1={venue} />);
    expect(screen.getByText(/LB Stadium Road \(0 Km\)/i)).toBeInTheDocument();
  });
});
