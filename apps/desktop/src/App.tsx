import { useState } from "react";
import styles from "styles/app.module.scss";
import { Container } from "./components/styles/atoms/Container/Container.styled.js";
import { ThemeProvider } from "styled-components";
import { theme } from "./Theme/theme.styled.js";
import { GlobalStyles } from "./components/styles/ReusableComponents/Global.styled.js";
import { Onboarding } from "./components/styles/ReusableComponents/OnboardingLayout/OnboardingLayout/OnboardingLayout.jsx";

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Onboarding />
      </ThemeProvider>
    </>
  );
};
export default App;
