import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled";
import { OnboradingMain } from "@/pages/onboarding/index.jsx";
import { Typography } from "./component/index.js";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <NavigationProvider> */}
      <Router>
        <GlobalStyles />
        <OnboradingMain></OnboradingMain>
      </Router>

      {/* </NavigationProvider> */}
    </ThemeProvider>
  );
};
export default App;
