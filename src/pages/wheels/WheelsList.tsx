import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

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

export const WheelsList = forwardRef<HTMLDivElement, WheelsListProps>(
  ({ className, list, rows, selected, onSelected, ...restProps }, ref): React.ReactElement => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [prevRef, setPrevRef] = useState(list);

    const wheelsRef = useRef<HTMLUListElement>(null);
    const prevList = useRef(list);

    const List = useCallback(() => {
      return (
        <ul ref={wheelsRef}>
          {list.map((value, index) => (
            <li key={index} role="option" aria-selected={selectedItem === value}>
              <p>{value}</p>
            </li>
          ))}
        </ul>
      );
    }, [prevRef]);

    useEffect(() => {
      const isChanged = JSON.stringify(prevList.current) !== JSON.stringify(list);

      if (isChanged) {
        prevList.current = list;
        setPrevRef(list);
      }
    }, [list]);

    useEffect(() => {
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
          el.style.transform = `rotateX(-${degree * index}deg) translateZ(${height}px)`;
        });

        // wheelsControl
        const wheelsControl = new WheelsControl(wheelsElement, degree, rows, onSelected);

        wheelsControl.selected(selected ?? '');
        wheelsControl.onSelected = (value, index) => {
          setSelectedItem(value);
          onSelected?.(value, index);
        };
      }
    }, [selected, prevList.current]);

    return (
      <div className={classNames('WheelsList', className)} ref={ref} {...restProps}>
        <List />
      </div>
    );
  }
);
