import { OnboardingMain } from "../pages/onboarding/index";
import { ONBOARDING_ROUTE_ROOT } from "./constantRoutePath";
import { Route, Routes } from "react-router-dom";

const RoutesCore: React.FC = () => {
  return (
    <Routes>
      <Route path={"*"} element={<OnboardingMain />} />
    </Routes>
  );
};

export default RoutesCore;


