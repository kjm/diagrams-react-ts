import React from 'react';

interface IProps {
  className: string;
  transform: string;
  height: number;
  width: number;
}

const WorkerItem: React.FC<IProps> = ({
  className,
  transform,
  height,
  width,
}: IProps) => {
  return (
    <rect
      rx={5}
      ry={5}
      y={0}
      className={className}
      transform={transform}
      height={height}
      width={width}
    />
  );
};

export default WorkerItem;
