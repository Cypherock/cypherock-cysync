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
import { SupplyChainAttack } from "./cardAuth/Dialogue/SupplyChainAttack";
import { AppClose } from "./cardAuth/Dialogue/AppClose";
import { CardPairing } from "./cardAuth/Dialogue/CardPairing";
import { Splash } from "./getStarted/Splash";
import { DeviceConnect } from "./update/DeviceConnect";
import { AppUpdate } from "./update/AppUpdate";
import { AppUpdateProgress } from "./update/AppUpdateProgress";
import { AppUpdateSuccess } from "./update/AppUpdateSuccess";
import { DeviceUpdate } from "./update/DeviceUpdate";
import { DeviceUpdateProgress } from "./update/DeviceUpdateProgress";
import { DeviceUpdateSuccess } from "./update/DeviceUpdateSuccess";
import { UpdateFailed } from "./update/UpdateFailed";
import { UpdateFailedAgain } from "./update/UpdateFailedAgain";
import { JoyStickToggleCenterButton } from "./joystickGuide/Dialogue/JoyStickToggleCenterButton";
import { JoyStickToggleSuccess } from "./joystickGuide/Dialogue/JoyStickSuccess";
import { SingleCardTapWalletExist } from "./cardAuth/Dialogue/SingleCardTapWalletExist";
import { DeviceAuthTestSuccess } from "./deviceAuthentication/DeviceAuthTestSuccess";
import { DeviceAuthTestFailedDeviceMisconfigured, DeviceAuthTestFailedFirmWareError, DeviceAuthTestFailedServerDown, DeviceAuthTestFailedServerError } from "./deviceAuthentication/DeviceAuthTestFailed";

export const OnboardingMain = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Splash />}></Route>
      <Route path="/information" element={<Information />}></Route>
      <Route path="/usage" element={<Usage />}></Route>
      <Route path="/welcome" element={<Welcome />}></Route>
      <Route path="/termsOfUse" element={<Terms />}></Route>
      
      {/* Email and password routes */}
      <Route path="/setPassword" element={<SetPassword />}></Route>
      <Route path="/setPasswordSucess" element={<PasswordSetSuccess />}></Route>
      <Route path="/setPasswordLogin" element={<DialogueLogin />}></Route>
      <Route path="/setPasswordReset" element={<DialogueResetPassword />}></Route>
      <Route path="/email2fa" element={<EmailConfirmation />}></Route>
      


      {/* Device Auth Routes */}
      <Route path="/deviceAuthTest" element={<DeviceAuthTest />}></Route>
      <Route path="/deviceAuthSuccess" element={<DeviceAuthTestSuccess />}> </Route>
      <Route path="/deviceAuthServerFail" element={<DeviceAuthTestFailedServerError />}> </Route>
      <Route path="/deviceAuthFirmwareError" element={<DeviceAuthTestFailedFirmWareError />}> </Route>
      <Route path="/deviceAuthServerDown" element={<DeviceAuthTestFailedServerDown />}> </Route>
      <Route path="/deviceAuthMisconfigure" element={<DeviceAuthTestFailedDeviceMisconfigured />}> </Route>


      {/* Card screens routes */}
      <Route path="/cardTap" element={<SingleCardTap />}></Route>
      <Route path="/cardExist" element={<SingleCardTapWalletExist />}></Route>
      <Route path="/supplyChainAttack" element={<SupplyChainAttack />}></Route>
      <Route path="/cardPair" element={<CardPairing/>}></Route>

      {/* Joystick screens routes */}
      <Route path="/joystick" element={<JoyStickToggle />}></Route>
      <Route path="/joystickCenter" element={<JoyStickToggleCenterButton />}></Route>
      <Route path="/joystickSuccess" element={<JoyStickToggleSuccess />}></Route>

      {/* Update screens routes */}
      <Route path="/deviceConnect" element={<DeviceConnect />}></Route>
      <Route path="/appUpdate" element={<AppUpdate />}></Route>
      <Route path="/appUpdateProgress" element={<AppUpdateProgress />}></Route>
      <Route path="/appUpdateSuccess" element={<AppUpdateSuccess />}></Route>
      <Route path="/deviceUpdate" element={<DeviceUpdate />}></Route>
      <Route path="/deviceUpdateProgress" element={<DeviceUpdateProgress />}></Route>
      <Route path="/deviceUpdateSuccess" element={<DeviceUpdateSuccess />}></Route>
      <Route path="/updateFailed" element={<UpdateFailed />}></Route>
      <Route path="/updateFailedAgain" element={<UpdateFailedAgain />}></Route>

      <Route path="/closeApp" element={<AppClose />}></Route>

    </Routes>
  );
};
