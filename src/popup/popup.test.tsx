import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './popup';

test('renders author page link', () => {
  render(<App />);
  const linkElement = screen.getByText(/OptikLab (C) 2024/i);
  expect(linkElement).toBeInTheDocument();
});