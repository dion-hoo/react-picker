import { forwardRef } from 'react';

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
      {wheelsData.map(({ list, initialValue, wheelsTo, wheelsSmoothTo, onChange }, index) => (
        <WheelsList
          key={index}
          rows={rows}
          list={list}
          initialValue={initialValue}
          wheelsTo={wheelsTo}
          wheelsSmoothTo={wheelsSmoothTo}
          onChange={onChange}
        />
      ))}

      <mark className="Wheels__mark" />
    </div>
  );
});
