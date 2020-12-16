import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkersDiagram from './WorkersDiagram';
import { initialWorkers } from './InitialData';

test('Renders <WorkersDiagram />', () => {
  render(<WorkersDiagram initialWorkers={initialWorkers} />);
});

test('Render svg element', () => {
  render(<WorkersDiagram initialWorkers={initialWorkers} />);
  const svg = screen.getByRole('graphics-document');
  expect(svg).toBeInTheDocument();
});

test('Render axes element', () => {
  render(<WorkersDiagram initialWorkers={initialWorkers} />);
  const xAxis = screen.getByLabelText('x-axis');
  expect(xAxis).toBeInTheDocument();
  const yAxis = screen.getByLabelText('y-axis');
  expect(yAxis).toBeInTheDocument();
});

test('Render diagram elements', () => {
  const { container } = render(
    <WorkersDiagram initialWorkers={initialWorkers} />
  );
  expect(container.getElementsByClassName('dg').length).toBe(1);
  expect(container.getElementsByClassName('axis').length).toBe(2);
  expect(container.getElementsByClassName('dg-workers').length).toBe(1);
});
