import { useEffect, useRef, FC } from "react";
import * as d3 from "d3";

/**
 * Mapping status to className
 */
const TaskStatus: { [key: string]: string } = {
  SUCCEEDED: "bar",
  FAILED: "bar-failed",
  RUNNING: "bar-running",
  KILLED: "bar-killed",
  CP: "bar-cp",
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

/**
 * Calculate number of unique workers from data
 * @param workers Workers array
 * @returns number of unique workers in data set
 */
const uniqueWorkers = (workers: Worker[]): number => {
  const unqWrk: { [key: number]: null } = {};
  workers.forEach((w) => {
    unqWrk[w.wrkrid] = null;
  });
  return Object.keys(unqWrk).length;
};

interface WorkersProps {
  initialWorkers: Worker[];
}

const WorkersDiagram: FC<WorkersProps> = ({ initialWorkers }: WorkersProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dgWorkers = useRef(null);
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

  const workerCount: number = uniqueWorkers(initialWorkers);
  const taskNames: string[] = Array.from(Array(workerCount + 1), (x, i) =>
    i.toString()
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

  const tickFormat = d3.timeFormat("%H:%M") as (
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
    return "translate(" + left + "," + y(d.taskName.toString()) + ")";
  };

  return (
    <div>
      <svg
        className="dg"
        ref={svgRef}
        width={width + margin.left + margin.right - 5}
        height={height + margin.top + margin.bottom}
      >
        <g id="axes">
          <g
            id="x-axis"
            ref={xAxisRef}
            transform={`translate(${margin.left}, ${height - margin.bottom})`}
          />
          <g
            id="y-axis"
            ref={yAxisRef}
            transform={`translate(${margin.left}, 0)`}
          />
        </g>
        <g
          id="dg-workers"
          ref={dgWorkers}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          {initialWorkers &&
            initialWorkers.map((w) => {
              const transform = rectTransform(w);
              const height = y.bandwidth();
              const _width = Math.max(1, x(w.enddttm) - x(w.startdttm));
              return (
                <rect
                  key={w.stepname}
                  rx={5}
                  ry={5}
                  className={TaskStatus[w.status]}
                  y={0}
                  transform={transform}
                  height={height}
                  width={_width}
                />
              );
            })}
        </g>
      </svg>
    </div>
  );
};

export default WorkersDiagram;
