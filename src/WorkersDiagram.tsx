import React, { useEffect, useRef, FC } from 'react';
import * as d3 from 'd3';
import WorkerItem from './WorkerItem';

/**
 * Calculate number of unique workers in dataset
 * @param workers Workers array to count from
 * @returns number of unique workers in dataset
 */
export const uniqueWorkers = (workers: Worker[]): number => {
  const unqWrk: { [key: number]: null } = {};
  workers.forEach((w) => {
    unqWrk[w.wrkrid] = null;
  });
  return Object.keys(unqWrk).length;
};

/**
 * Mapping status to className
 */
const TaskStatus: { [key: string]: string } = {
  SUCCEEDED: 'bar',
  FAILED: 'bar-failed',
  RUNNING: 'bar-running',
  KILLED: 'bar-killed',
  CP: 'bar-cp',
};

/* Diagram margins */
type Margin = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type Worker = {
  loadid: number;
  wrkrid: number;
  taskName: number;
  fcp: boolean;
  rcp: boolean;
  startdttm: Date;
  enddttm: Date;
  stepname: string;
  status: string;
};

interface WorkersProps {
  initialWorkers: Worker[];
}

const WorkersDiagram: FC<WorkersProps> = ({ initialWorkers }: WorkersProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const xAxisRef = useRef<SVGSVGElement | null>(null);
  const yAxisRef = useRef<SVGSVGElement | null>(null);
  const width: number = 1200;
  const height: number = 400;
  const margin: Margin = {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  };

  const taskNames: string[] = Array.from(
    Array(uniqueWorkers(initialWorkers) + 1),
    (x, i) => i.toString()
  );
  taskNames.shift();

  const timeDomain: Date[] = [
    initialWorkers[0].startdttm,
    initialWorkers[initialWorkers.length - 1].enddttm,
  ];

  const x = d3.scaleTime().domain(timeDomain).range([0, width]).clamp(true);
  const y = d3
    .scaleBand()
    .domain(taskNames)
    .rangeRound([0, height - margin.top - margin.bottom])
    .padding(0.2);

  const tickFormat = d3.timeFormat('%H:%M') as (
    value: Date | { valueOf(): number },
    i: number
  ) => string;

  const xAxis: any = d3
    .axisBottom(x)
    .tickFormat(tickFormat)
    .tickSize(8)
    .tickPadding(8);
  const yAxis: any = d3.axisLeft(y).tickSize(3).tickPadding(6);

  useEffect(() => {
    d3.select(xAxisRef.current).call(xAxis);
    d3.select(yAxisRef.current).call(yAxis);
  }, [xAxis, yAxis]);

  const rectTransform = (d: Worker): string => {
    const left = 1 + margin.left + x(d.startdttm);
    return 'translate(' + left + ',' + y(d.taskName.toString()) + ')';
  };

  return (
    <div>
      <svg
        className="dg"
        ref={svgRef}
        width={width + margin.left + margin.right - 5}
        height={height + margin.top + margin.bottom}
        id="diagram"
        role="graphics-document"
      >
        <g id="axes">
          <g
            id="x-axis"
            className="axis"
            ref={xAxisRef}
            transform={`translate(${margin.left}, ${height - margin.bottom})`}
            aria-label="x-axis"
          />
          <g
            id="y-axis"
            className="axis"
            ref={yAxisRef}
            transform={`translate(${margin.left}, 0)`}
            aria-label="y-axis"
          />
        </g>
        <g
          id="dg-workers"
          className="dg-workers"
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          {initialWorkers &&
            initialWorkers.map((w, idx) => {
              return (
                <WorkerItem
                  key={idx}
                  className={TaskStatus[w.status]}
                  transform={rectTransform(w)}
                  height={y.bandwidth()}
                  width={Math.max(1, x(w.enddttm) - x(w.startdttm))}
                />
              );
            })}
        </g>
      </svg>
    </div>
  );
};

export default WorkersDiagram;
