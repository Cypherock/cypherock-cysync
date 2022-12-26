import { useState } from "react";
import styles from "styles/app.module.scss";
import { Container } from "./components/styles/Container.styled.js";
import { ThemeProvider } from "styled-components";

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider>
        <Container>
          <h1>Ramandeep</h1>
        </Container>
      </ThemeProvider>
    </>
  );
};
export default App;
