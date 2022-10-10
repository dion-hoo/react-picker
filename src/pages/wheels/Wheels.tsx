import { forwardRef, useEffect } from 'react';

import classNames from 'classnames';

import { WheelsList, WheelsListProps } from './WheelsList';

import './Wheels.scss';

export interface WheelsProps {
  className?: string;
  rows?: WheelsListProps['rows'];
  wheelsData: Omit<WheelsListProps, 'rows'>[];
}

export const Wheels = forwardRef<HTMLDivElement, WheelsProps>(({ className, rows = 7, wheelsData, ...restProps }, ref) => {
  return (
    <div
      className={classNames('Wheels', className, {
        [`Wheels--${rows === 7 ? 'seven' : 'nine'}`]: rows,
      })}
      ref={ref}
      {...restProps}
    >
      {wheelsData.map(({ list, selected, onSelected }, index) => (
        <WheelsList key={index} rows={rows} list={list} selected={selected} onSelected={onSelected} />
      ))}

      <mark className="Wheels__mark" />
    </div>
  );
});
