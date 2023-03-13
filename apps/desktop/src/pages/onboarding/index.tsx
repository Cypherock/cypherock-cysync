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
import { JoyStickToggle } from "./joystickGuide/Dialogue/JoystickToggle";
import { SingleCardTap } from "./cardAuth/Dialogue/SingleCardTap";
import { Support } from "./cardAuth/Dialogue/Support";
import { SupplyChainAttack } from "./cardAuth/Dialogue/SupplyChainAttack";
import { AppClose } from "./cardAuth/Dialogue/AppClose";
import { CardPairing } from "./cardAuth/Dialogue/CardPairing";

export const OnboradingMain = (): JSX.Element => {
  return (
    <Routes>
      {/* <Route path="/" element={<Information />}></Route>
      <Route path="/usage" element={<Usage />}></Route>
      <Route path="/welcome" element={<Welcome />}></Route>
      <Route path="/termsOfUse" element={<Terms />}></Route>
      <Route path="/setPassword" element={<SetPassword />}></Route>
      <Route path="/setPasswordSucess" element={<PasswordSetSuccess />}></Route>
      <Route path="/setPasswordLogin" element={<DialogueLogin />}></Route>
      <Route path="/setPasswordReset" element={<DialogueResetPassword />}></Route>
      <Route path="/email2fa" element={<EmailConfirmation />}></Route>
      <Route path="/deviceAuthTest" element={<DeviceAuthTest />}></Route>
      <Route path="/joystick" element={<JoyStickToggle />}></Route>
      <Route path="/cardTap" element={<SingleCardTap />}></Route> */}
      <Route path="/" element={<SupplyChainAttack />}></Route>
      {/* <Route path="/contactSupport" element={<Support />}></Route>
      <Route path="/closeApp" element={<AppClose />}></Route>
      <Route path="/cardPair" element={<CardPairing/>}></Route> */}

    </Routes>
  );
};
