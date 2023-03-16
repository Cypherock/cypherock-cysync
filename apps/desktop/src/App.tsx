import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled";
import { OnboardingMain } from "@/pages/onboarding/index.jsx";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <NavigationProvider> */}
      <Router>
        <GlobalStyles />
        <OnboardingMain></OnboardingMain>
      </Router>

      {/* </NavigationProvider> */}
    </ThemeProvider>
  );
};
export default App;
