import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Splash } from './GetStarted/Splash';
import { Information } from './GetStarted/Information';
import { Welcome } from './GetStarted/Welcome';
import { Usage } from './GetStarted/Usage';
import { Terms } from './TermsOfUse/Terms';

export const OnBoardingMain = (): ReactElement => (
  <Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/information" element={<Information />} />
    <Route path="/usage" element={<Usage />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/termsOfUse" element={<Terms />} />
  </Routes>
);
