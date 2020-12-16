import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders App', () => {
  render(<App />);
});

test('Renders workers tab', () => {
  render(<App />);
  const tabs = screen.getByText(/Workers diagram/i);
  expect(tabs).toBeInTheDocument();
});
