import { Analytics } from "@vercel/analytics/dist/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router";

import Head from "./components/Head";
import Body from "./components/Body";
import About from "./About";
import Contact from "./Contact";
import Error from "./Error";
import Home from "./Home";
import VenueDetailsnew from "./components/VenueDetailsnew";
import BookingSuccessful from "./components/BookingSuccessful";

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout component
// Layout component
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  return (
    <>
      <ScrollToTop />

      {!isHomePage && (
        <Head selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      )}

      <Outlet context={{ selectedCity, setSelectedCity }} />

      <Analytics />
    </>
  );
};

const appRouter = createBrowserRouter([
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);
