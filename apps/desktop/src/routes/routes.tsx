import { OnboardingMain } from "@pages/onboarding";
import { ONBOARDING_ROUTE_ROOT } from "./constantRoutePath";
import { Route, Routes } from "react-router-dom";
import { Component } from "react";

export default class RoutesCore extends Component {
   renderRoutes = (): JSX.Element => {
    return (
      <Routes>
        <Route path={ONBOARDING_ROUTE_ROOT} element={<OnboardingMain />} />
      </Routes>
    );
  };

  render() {
    return <>{this.renderRoutes()}</>;
  }
}


