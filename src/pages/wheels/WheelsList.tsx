import * as React from 'react';

import classNames from 'classnames';

import { WheelsControl } from './Wheel';

import './WheelsList.scss';

export interface WheelsListProps {
  /** className을 설정합니다 */
  className?: string;
  /** wheels 데이터를 설정합니다 */
  list: string[];
  /** 리스트의 갯수를 설정합니다 */
  rows: 7 | 9;
  /** selected 설정합니다 */
  selected?: string | number;
  /** onSelected Event*/
  onSelected?: (value: string, index: number) => void;
}

/**
 * @param onSelected onSelected Event의 callback으로 value, index값을 반환합니다
 */

export const WheelsList = React.forwardRef<HTMLDivElement, WheelsListProps>(
  (
    { className, list, rows, selected, onSelected, ...restProps },
    ref
  ): React.ReactElement => {
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

    const wheelsRef = React.useRef<HTMLUListElement>(null);
    const previousList = React.useRef(list);

    // 이전 리스트랑 다를때만 ref를 초기화 시켜주기 위해서
    const UList = React.useCallback(
      ({ children }: any) => {
        return <ul ref={wheelsRef}>{children}</ul>;
      },
      [previousList.current]
    );

    React.useEffect(() => {
      const isChanged =
        JSON.stringify(previousList.current) !== JSON.stringify(list);

      if (isChanged) {
        previousList.current = list;
      }
    }, [list]);

    React.useEffect(() => {
      const wheelsElement = wheelsRef.current;

      if (wheelsElement) {
        const wheelsList = Array.from(wheelsElement.children);
        const [firstNode] = wheelsList;

        const height = wheelsElement.offsetHeight / 2;
        const itemHeight = firstNode.clientHeight / 2;
        const angle = Math.atan(itemHeight / height) * 2;
        const degree = (angle * 180) / Math.PI;

        wheelsList.map((element, index) => {
          const el = element as HTMLElement;
          el.style.transform = `rotateX(-${
            degree * index
          }deg) translateZ(${height}px)`;
        });

        // wheelsControl
        const wheelsControl = new WheelsControl(
          wheelsElement,
          degree,
          rows,
          onSelected
        );

        wheelsControl.selected(selected ?? '');
        wheelsControl.onSelected = (value, index) => {
          setSelectedItem(value);
          onSelected?.(value, index);
        };
      }
    }, [selected]);

    return (
      <div
        className={classNames('kp-picker-wheels-list', className)}
        ref={ref}
        {...restProps}
      >
        <UList>
          {list.map((value, index) => (
            <li
              key={index}
              role="option"
              aria-selected={selectedItem === value}
            >
              <p>{value}</p>
            </li>
          ))}
        </UList>
      </div>
    );
  }
);
