// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./components/AppLayout";

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
