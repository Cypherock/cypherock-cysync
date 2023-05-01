import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Splash } from './GetStarted/Splash';
import { Information } from './GetStarted/Information';
import { Welcome } from './GetStarted/Welcome';
import { Usage } from './GetStarted/Usage';
import { Terms } from './TermsOfUse/Terms';
import { SetPassword } from './SetPassword/Dialogue/SetPassword';
import { PasswordSetSuccess } from './SetPassword/Dialogue/PasswordSetSuccess';
import { DialogueLogin } from './SetPassword/Dialogue/DialogueLogin';
import { DialogueResetPassword } from './SetPassword/Dialogue/DialogueResetPassword';
import { EmailConfirmation } from './AuthEmail/EmailConfirmation';
import { SingleCardTap } from './CardAuth/Dialogue/SingleCardTap';
import { SingleCardTapWalletExist } from './CardAuth/Dialogue/SingleCardTapWalletExist';
import { SupplyChainAttack } from './CardAuth/Dialogue/SupplyChainAttack';
import { CardPairing } from './CardAuth/Dialogue/CardPairing';
import { JoyStickToggle } from './JoystickGuide/Dialogue/JoystickToggle';
import { JoyStickToggleCenterButton } from './JoystickGuide/Dialogue/JoyStickToggleCenterButton';
import { JoyStickToggleSuccess } from './JoystickGuide/Dialogue/JoyStickSuccess';
import { DeviceConnect } from './Update/DeviceConnect';
import { AppUpdate } from './Update/AppUpdate';
import { AppUpdateProgress } from './Update/AppUpdateProgress';
import { AppUpdateSuccess } from './Update/AppUpdateSuccess';
import { DeviceUpdate } from './Update/DeviceUpdate';
import { DeviceUpdateProgress } from './Update/DeviceUpdateProgress';
import { DeviceUpdateSuccess } from './Update/DeviceUpdateSuccess';
import { UpdateFailed } from './Update/UpdateFailed';
import { UpdateFailedAgain } from './Update/UpdateFailedAgain';
import { AppClose } from './CardAuth/Dialogue/AppClose';

export const OnBoardingMain = (): ReactElement => (
  <Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/information" element={<Information />} />
    <Route path="/usage" element={<Usage />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/termsOfUse" element={<Terms />} />

    {/* Email and password routes */}
    <Route path="/setPassword" element={<SetPassword />} />
    <Route path="/setPasswordSucess" element={<PasswordSetSuccess />} />
    <Route path="/setPasswordLogin" element={<DialogueLogin />} />
    <Route path="/setPasswordReset" element={<DialogueResetPassword />} />
    <Route path="/email2fa" element={<EmailConfirmation />} />

    {/* Card screens routes */}
    <Route path="/cardTap" element={<SingleCardTap />} />
    <Route path="/cardExist" element={<SingleCardTapWalletExist />} />
    <Route path="/supplyChainAttack" element={<SupplyChainAttack />} />
    <Route path="/cardPair" element={<CardPairing />} />

    {/* Joystick screens routes */}
    <Route path="/joystick" element={<JoyStickToggle />} />
    <Route path="/joystickCenter" element={<JoyStickToggleCenterButton />} />
    <Route path="/joystickSuccess" element={<JoyStickToggleSuccess />} />

    {/* Update screens routes */}
    <Route path="/deviceConnect" element={<DeviceConnect />} />
    <Route path="/appUpdate" element={<AppUpdate />} />
    <Route path="/appUpdateProgress" element={<AppUpdateProgress />} />
    <Route path="/appUpdateSuccess" element={<AppUpdateSuccess />} />
    <Route path="/deviceUpdate" element={<DeviceUpdate />} />
    <Route path="/deviceUpdateProgress" element={<DeviceUpdateProgress />} />
    <Route path="/deviceUpdateSuccess" element={<DeviceUpdateSuccess />} />
    <Route path="/updateFailed" element={<UpdateFailed />} />
    <Route path="/updateFailedAgain" element={<UpdateFailedAgain />} />

    <Route path="/closeApp" element={<AppClose />} />
  </Routes>
);
