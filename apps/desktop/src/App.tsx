import { Container } from "./components/styles/atoms/Container/Container.styled.js";
import { ThemeProvider } from "styled-components";
import { theme } from "./Theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled.js";
import { GetStarted } from "./Pages/Onboarding/GetStarted/index.js";
const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <GetStarted />
      </ThemeProvider>
    </>
  );
};
export default App;
