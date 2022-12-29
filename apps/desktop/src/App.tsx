import { useState } from "react";
import styles from "styles/app.module.scss";
import { Container } from "./components/styles/Container.styled.js";
import { ThemeProvider } from "styled-components";
import { theme } from "./Theme/theme.styled.js";
import { GlobalStyles } from "./components/styles/Global.styled.js";
import { SplashLoader } from "./components/Onboarding/SplashLoader.jsx";
import { Information } from "./components/Onboarding/Information/Information.jsx";

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/* <SplashLoader /> */}
        <Information />
      </ThemeProvider>
    </>
  );
};
export default App;
