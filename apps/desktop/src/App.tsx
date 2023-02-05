import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled.js";
import { GetStarted } from "./pages/onboarding/GetStarted/index.js";
import { MainApp } from "./pages/mainApp/index.js";
import { NavigationProvider } from "./context/navigationContext.js";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavigationProvider>
        <GlobalStyles />
        {/* <GetStarted /> */}
        {/* <MainApp /> */}
      </NavigationProvider>
    </ThemeProvider>
  );
};
export default App;
