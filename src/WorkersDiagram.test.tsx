import React from "react";
import { render } from "@testing-library/react";
import WorkersDiagram from "./WorkersDiagram";
import { initialWorkers } from "./InitialData";

test("Renders <WorkersDiagram />", () => {
  render(<WorkersDiagram initialWorkers={initialWorkers} />);
});

test("Renders diagram elements", () => {
  const { container } = render(
    <WorkersDiagram initialWorkers={initialWorkers} />
  );
  expect(container.getElementsByClassName("dg").length).toBe(1);
  expect(container.getElementsByClassName("axis").length).toBe(2);
  expect(container.getElementsByClassName("dg-workers").length).toBe(1);
});
