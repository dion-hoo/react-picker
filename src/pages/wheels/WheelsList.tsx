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
  /** 초기값을 설정합니다 */
  initialValue?: string | number;
  /** 설정한 값으로 이동합니다. */
  wheelsTo?: {
    target: string;
  };
  /** 설정한 값으로 부드럽게 이동합니다. */
  wheelsSmoothTo?: {
    target: string;
  };
  /** onChange Event */
  onChange?: (value: string, index: number) => void;
}

/**
 * @param onChange onChange Event의 callback으로 value, index값을 반환합니다
 */

export type ANIMATIONTYPE = 'ANIMATION' | 'NOANIMATION';
export const ANIMATIONDATA = {
  ANIMATION: 'ANIMATION',
  NOANIMATION: 'NOANIMATION',
} as const;

export const WheelsList = forwardRef<HTMLDivElement, WheelsListProps>(
  ({ className, list, rows, initialValue, wheelsTo, wheelsSmoothTo, onChange, ...restProps }, ref): React.ReactElement => {
    const [prevRef, setPrevRef] = useState(list);
    const [wheelsClass, setWheelsClass] = useState<WheelsControl | null>(null);

    const wheelsRef = useRef<HTMLUListElement>(null);
    const prevList = useRef(list);

    /**
     * ref를 초기화 : React과 이전 ref값을 계속 가지고 있다.
     * 휠, 클릭으로 선택 된 값(or 인덱스)으로 하는데, 이전에 가지고 있던 ref값과 새로운 ref값이 동시에 존재하기 때문에 초기화!!
     *
     * 1. 이전 리스트랑 다를때(새로운 리스트가 생겼을때)
     */
    const List = useCallback(() => {
      return (
        <ul ref={wheelsRef}>
          {list.map((value, index) => (
            <li key={index} role="option">
              <p>{value}</p>
            </li>
          ))}
        </ul>
      );
    }, [prevRef]);

    useEffect(() => {
      const wheelsTarget = wheelsTo?.target || wheelsSmoothTo?.target;
      let timeFunction;

      if (wheelsTo?.target) {
        timeFunction = ANIMATIONDATA.NOANIMATION;
      }

      if (wheelsSmoothTo?.target) {
        timeFunction = ANIMATIONDATA.ANIMATION;
      }

      if (wheelsClass) {
        wheelsClass.selected(wheelsTarget, timeFunction);
      }
    }, [wheelsTo, wheelsSmoothTo]);

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
        const wheelsControl = new WheelsControl(wheelsElement, degree, rows, onChange);

        wheelsControl.selected(initialValue ?? '');
        wheelsControl.onChange = (value, index) => {
          onChange?.(value, index);
        };

        setWheelsClass(wheelsControl);
      }
    }, [prevList.current]);

    return (
      <div className={classNames('WheelsList', className)} ref={ref} {...restProps}>
        <List />
      </div>
    );
  }
);
