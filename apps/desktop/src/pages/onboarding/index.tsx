import React, { useState } from "react";

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
import { ONBOARDING_ROUTE_ROOT,
  ONBOARDING_ROUTE_INFO,
  ONBOARDING_ROUTE_USAGE,
  ONBOARDING_ROUTE_WELCOME,
  ONBOARDING_ROUTE_TERMS_OF_USE,
  ONBOARDING_ROUTE_SET_PASSWORD,
  ONBOARDING_ROUTE_SET_PASSWORD_SUCCESS,
  ONBOARDING_ROUTE_SET_PASSWORD_FAIL,
  ONBOARDING_ROUTE_LOGIN,
  ONBOARDING_ROUTE__RESET_PASSWORD,
  ONBOARDING_ROUTE_EMAIL_2FA,
  ONBOARDING_ROUTE_DEVICE_AUTH_TEST,
  ONBOARDING_ROUTE_DEVICE_AUTH_SUCCESS,
  ONBOARDING_ROUTE_DEVICE_AUTH_SERVER_ERROR,
  ONBOARDING_ROUTE_DEVICE_AUTH_FIRMWARE_ERROR,
  ONBOARDING_ROUTE_DEVICE_AUTH_SERVER_DOWN,
  ONBOARDING_ROUTE_DEVICE_AUTH_MISCONFIGURED_ERROR,
  ONBOARDING_ROUTE_CARD_TAP,
  ONBOARDING_ROUTE_CARD_EXIST,
  ONBOARDING_ROUTE_CARD_SUPPLY_CHAIN_ATTACK,
  ONBOARDING_ROUTE_CARD_PAIRING,
  ONBOARDING_ROUTE_JOYSTICK_TOGGLE,
  ONBOARDING_ROUTE_JOYSTICK_TOGGLE_CENTER,
  ONBOARDING_ROUTE_JOYSTICK_SUCCESS,
  ONBOARDING_ROUTE_CONNECT_DEVICE,
  ONBOARDING_ROUTE_UPDATE_APP,
  ONBOARDING_ROUTE_UPDATE_APP_PROGRESS,
  ONBOARDING_ROUTE_UPDATE_APP_SUCCESS,
  ONBOARDING_ROUTE_UPDATE_APP_FAIL,
  ONBOARDING_ROUTE_UPDATE_RETRY_FAIL,
  ONBOARDING_ROUTE_UPDATE_DEVICE,
  ONBOARDING_ROUTE_UPDATE_DEVICE_PROGRESS,
  ONBOARDING_ROUTE_UPDATE_DEVICE_SUCCESS,
  ONBOARDING_ROUTE_UPDATE_DEVICE_FAIL, } from "../../routes/constantRoutePath";
import { ServerStyleSheet } from "styled-components";
import { useSteps } from "../../hooks/steps";


export const OnboardingMain = (): JSX.Element => {
  const { step, nextStep, prevStep } = useSteps();
  const OnboardingStepsComponents = [
    <Splash onNext={
      () => {
        nextStep();
      }
    } />,
    <Information onNext=
      {
        () => {
          nextStep();
        } 
      }
    />,
    <Usage />,
    <Welcome />,
    <Terms />,

    <SetPassword />,
    <PasswordSetSuccess />,
    <DialogueLogin />,
    <DialogueResetPassword />,
    <EmailConfirmation />,
    <DeviceAuthTest />,
    <DeviceAuthTestSuccess />,
    <DeviceAuthTestFailedServerError />,
    <DeviceAuthTestFailedFirmWareError />,
    <DeviceAuthTestFailedServerDown />,
    <DeviceAuthTestFailedDeviceMisconfigured />,
    <SingleCardTap />,
    <SingleCardTapWalletExist />,
    <SupplyChainAttack />,
    <CardPairing />,
    <JoyStickToggle />,
    <JoyStickToggleCenterButton />,
    <JoyStickToggleSuccess />,
    <DeviceConnect />,
    <AppUpdate />,
    <AppUpdateProgress />,
    <AppUpdateSuccess />,
    <UpdateFailed />,
    <UpdateFailedAgain />,
    <DeviceUpdate />,
    <DeviceUpdateProgress />,
    <DeviceUpdateSuccess />,
    <UpdateFailed />,
    <UpdateFailedAgain />,


  ];

  return (
    <div className="onboarding">
     {OnboardingStepsComponents[step]} 
    
    </div>
  );
};
