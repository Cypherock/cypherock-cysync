import { Information } from "./getStarted/Information";
import { Routes, Route } from "react-router-dom";
import { Welcome } from "./getStarted/Welcome";
import { Terms } from "./termsOfUse/Terms";
import { SetPassword } from "./setPassword/Dialogue/SetPassword";
import { PasswordSetSuccess } from "./setPassword/Dialogue/PasswordSetSuccess";
import { DialogueResetPassword } from "./setPassword/Dialogue/DialogueResetPassword";
import { DialogueLogin } from "./setPassword/Dialogue/DialogueLogin";
import { EmailConfirmation } from "./authEmail/EmailConfirmation";
import { DeviceAuthTest } from "./deviceAuthentication/DeviceAuthTest";
import { Usage } from "./getStarted/Usage";

export const OnboradingMain = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Information />}></Route>
      <Route path="/usage" element={<Usage />}></Route>
      <Route path="/welcome" element={<Welcome />}></Route>
      <Route path="/termsOfUse" element={<Terms />}></Route>
      <Route path="/setPassword" element={<SetPassword />}></Route>
      <Route path="/setPasswordSucess" element={<PasswordSetSuccess />}></Route>
      <Route path="/setPasswordLogin" element={<DialogueLogin />}></Route>
      <Route path="/setPasswordReset" element={<DialogueResetPassword />}></Route>
      <Route path="/email2fa" element={<EmailConfirmation />}></Route>
      <Route path="/deviceAuthTest" element={<DeviceAuthTest />}></Route>
    </Routes>
  );
};
