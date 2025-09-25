// src/components/AppLayout.jsx
import React, { useState } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom"; // use react-router-dom
import Head from "./Head";
import Body from "./Body";
import About from "../About";
import Contact from "../Contact";
import Error from "../Error";
import Home from "../Home";
import VenueDetailsnew from "./VenueDetailsnew";
import BookingSuccessful from "./BookingSuccessful";

export const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  return (
    <div id="root">
      {!isHomePage && (
        <Head selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      )}
      <Outlet context={{ selectedCity, setSelectedCity }} />
    </div>
  );
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: ":city", element: <Body /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "venuedetails/:city/:activeKey", element: <VenueDetailsnew /> },
      { path: "booking-successful", element: <BookingSuccessful /> },
    ],
  },
]);
