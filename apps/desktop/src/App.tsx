import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.styled.js";
import { GlobalStyles } from "./style/Global.styled";
import RoutesCore from "./routes/routes";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <NavigationProvider> */}
      <Router>
        <GlobalStyles />
        <RoutesCore />
      </Router>

      {/* </NavigationProvider> */}
    </ThemeProvider>
  );
};
export default App;
