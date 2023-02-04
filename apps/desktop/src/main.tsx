import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./samples/node-api";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled.js";
import { NavigationProvider } from "./context/navigationContext.js";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <NavigationProvider>
          <GlobalStyles />
          <App />
        </NavigationProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
