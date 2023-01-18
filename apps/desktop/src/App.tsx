import { Container } from "./components/styles/atoms/Container/Container.styled.js";
import { themeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled.js";
import { GetStarted } from "./Pages/Onboarding/GetStarted/index.js";
const App: React.FC = () => {
  return (
    <>
      <themeProvider theme={theme}>
        <GlobalStyles />
        <GetStarted />
      </themeProvider>
    </>
  );
};
export default App;
