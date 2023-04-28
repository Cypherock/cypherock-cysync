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
  </Routes>
);
