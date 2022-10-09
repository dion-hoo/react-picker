import * as React from 'react';

import classNames from 'classnames';

import { WheelsList, WheelsListProps } from './WheelsList';

import './Wheels.scss';

export interface WheelsProps extends Omit<WheelsListProps, 'rows'> {
  rows?: WheelsListProps['rows'];
  wheelsData: Omit<WheelsListProps[], 'rows'>;
}

export const Wheels = React.forwardRef<HTMLDivElement, WheelsProps>(
  ({ className, rows = 7, wheelsData, ...restProps }, ref) => {
    return (
      <div
        className={classNames('kp-picker-wheels', className, {
          [`kp-picker-wheels-${rows === 7 ? 'seven' : 'nine'}`]: rows,
        })}
        ref={ref}
        {...restProps}
      >
        {wheelsData.map(({ list, selected, onSelected }, index) => (
          <WheelsList
            key={index}
            rows={rows}
            list={list}
            selected={selected}
            onSelected={onSelected}
          />
        ))}

        <mark className="kp-picker-wheels-mark" />
      </div>
    );
  }
);
