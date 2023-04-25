import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Splash } from './getStarted/Splash';

export const OnBoardingMain = (): ReactElement => (
  <Routes>
    <Route path="/" element={<Splash />} />
  </Routes>
);
