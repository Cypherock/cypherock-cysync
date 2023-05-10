import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from './__helpers__/react';

import { Splash } from '../src';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(Splash).toBeDefined();
  });

  test('should render', async () => {
    render(<Splash />);

    const btn = screen.getAllByRole('button');
    expect(btn).toBeDefined();
    expect(btn.length).toBeGreaterThan(0);
  });
});
