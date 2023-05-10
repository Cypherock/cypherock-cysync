import React from 'react';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from './__helpers__/react';

import { Button } from '../src';

describe('Export test', () => {
  test('should export render function', async () => {
    expect(Button).toBeDefined();
  });

  test('should render', async () => {
    render(<Button />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDefined();
  });
});
