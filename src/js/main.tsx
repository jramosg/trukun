import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";

const container = document.getElementById("root");
const root = createRoot(container!);

// Render the app
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App></App>
    </Provider>
  </React.StrictMode>
);
