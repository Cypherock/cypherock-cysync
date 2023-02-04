import { OnboradingMain } from "./pages/Onboarding";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboradingMain />} />
      </Routes>
    </>
  );
};
export default App;
