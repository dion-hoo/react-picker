import { easeOutExpo } from './Easing';

export class WheelsControl {
  list: HTMLUListElement;
  listItem: Element[];
  length: number;
  angle: number;
  rows: number;
  cancelAnimation: number;
  isOtherValue: boolean;

  // mouse
  isDown: boolean;
  direction: 'UP' | 'DOWN';
  mouse: {
    moveY: number;
    offsetY: number;
  };

  // position
  scroll: number;
  moveEndScroll: number;

  // speed
  velocity: number;

  // event
  onSelected: ((value: string, index: number) => void) | undefined;

  constructor(
    list: HTMLUListElement,
    angle: number,
    rows: number,
    onSelected: ((value: string, index: number) => void) | undefined
  ) {
    this.list = list;
    this.listItem = Array.from(this.list.children);
    this.length = this.listItem.length;
    this.angle = angle;
    this.rows = rows;
    this.cancelAnimation = 0;
    this.isOtherValue = false; // 다른 값이 선택되는지 확인하는 boolean

    // mouse
    this.isDown = false;
    this.direction = 'DOWN';
    this.mouse = {
      moveY: 0,
      offsetY: 0,
    };

    // position
    this.scroll = 0;
    this.moveEndScroll = 0;

    // speed
    this.velocity = 6;

    // event
    this.init();
    this.onSelected = onSelected;
  }

  init() {
    this.list.addEventListener('touchstart', this.onDown.bind(this));
    this.list.addEventListener('touchmove', this.onMove.bind(this));
    this.list.addEventListener('touchend', this.onUp.bind(this));

    this.list.addEventListener('mousedown', this.onDown.bind(this));
    this.list.addEventListener('mousemove', this.onMove.bind(this));
    this.list.addEventListener('mouseup', this.onUp.bind(this));
    this.list.addEventListener('mouseleave', this.onUp.bind(this));
  }

  destory() {
    this.list.removeEventListener('touchstart', this.onDown.bind(this));
    this.list.removeEventListener('touchmove', this.onMove.bind(this));
    this.list.removeEventListener('touchend', this.onUp.bind(this));

    this.list.removeEventListener('mousedown', this.onDown.bind(this));
    this.list.removeEventListener('mousemove', this.onMove.bind(this));
    this.list.removeEventListener('mouseup', this.onUp.bind(this));
    this.list.removeEventListener('mouseleave', this.onUp.bind(this));
  }

  onDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    this.isDown = true;
    this.moveEndScroll = this.scroll;

    this.mouse.moveY = 0;
    this.mouse.offsetY =
      event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

    // animation stop
    this.stopAnimation();
  }

  onMove(event: MouseEvent | TouchEvent) {
    if (this.isDown) {
      const { offsetY } = this.mouse;
      const clientY =
        event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

      this.mouse.moveY = offsetY - clientY;
      this.mouse.offsetY = clientY;
      this.direction = this.mouse.moveY < 0 ? 'UP' : 'DOWN';

      let moveingScroll = this.moveEndScroll + this.mouse.moveY * 0.033;

      if (moveingScroll < -1) {
        moveingScroll = moveingScroll * 0.94;
      } else if (moveingScroll > this.length) {
        moveingScroll = this.length + (moveingScroll - this.length) * 0.94;
      }

      this.moveEndScroll = this.moveScroll(moveingScroll);
    }
  }

  onUp(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    if (this.isDown) {
      const startIndex = Math.round(this.moveEndScroll); // 마우스를 뗐을 때 현재 인덱스 번호
      let distance = this.mouse.moveY * 0.4;
      let endIndex = Math.round(startIndex + distance);
      endIndex =
        endIndex < 0
          ? 0
          : endIndex > this.length - 1
            ? this.length - 1
            : endIndex;

      /**
       * wheel이 선택한 Index에 도달했는지 판단하는 변수
         마우스를 down -> scroll -> up후에, 다시 마우스를 down -> up 했을때,
         클릭 이벤트와 같은 효과가 발생하는데 이때 피커가 움직이고 있기 때문에 클릭 이벤트를 막기 위한 변수
      */
      const isReach =
        this.moveEndScroll + this.mouse.moveY === Math.round(this.scroll);

      // wheel이 0보다 작거나 리스트 보다 클때
      const bothWard =
        this.moveEndScroll < 0 || this.moveEndScroll > this.length - 1;

      // 클릭 했을 경우
      if (isReach) {
        const target = event.target;
        const index = this.listItem.findIndex((el) => el === target);

        index > endIndex ? (this.direction = 'DOWN') : (this.direction = 'UP');

        this.isOtherValue = index !== endIndex; // 클릭한 (index)값이 현재 active되어 있는 스크롤 위치와(this.scroll)과 다를때만 true

        distance = endIndex - index;
        endIndex = index < 0 ? 0 : index;
      }

      /**
       * animation 되어야 하는 경우는 총 3가지이다.
         1. 다른 값을 선택했거나
         2. up했을때 도달해야하는 위치에 도착하지 않았을때
         3. 리스트 양쪽 보다 작거나 클때
      */
      if (this.isOtherValue || !isReach || bothWard) {
        const time = Math.abs(distance / this.velocity);

        this.animationScroll(startIndex, endIndex, time);
      }
    }

    this.isDown = false;
    this.destory();
  }

  moveScroll(scroll: number) {
    this.list.style.transform = `rotateX(${scroll * this.angle}deg)`;

    this.listItem.map((element, index) => {
      const el = element as HTMLElement;
      const paragraph = el.children[0] as HTMLElement;
      const range = Math.abs(scroll - index);
      const FONTSIZE = 24; // 기본 폰트 사이즈
      const MULTIPLE = 3; // 폰트 사이즈 줄이는 배수
      const visibleRange = Math.round(this.rows / 2);

      index - 1 <= scroll && range < 0.5
        ? el.classList.add('kp-picker-wheels-active')
        : el.classList.remove('kp-picker-wheels-active');

      el.style.visibility = range <= visibleRange ? 'visible' : 'hidden';

      if (this.direction === 'DOWN') {
        // 아래서 위로 올렸을 경우(down)
        paragraph.style.fontSize =
          scroll - index < 0
            ? `${Math.ceil(FONTSIZE - MULTIPLE * range)}px`
            : `${Math.floor(FONTSIZE - MULTIPLE * range)}px`;
      } else {
        // up
        paragraph.style.fontSize =
          scroll - index < 0
            ? `${Math.floor(FONTSIZE - MULTIPLE * range)}px`
            : `${Math.ceil(FONTSIZE - MULTIPLE * range)}px`;
      }
    });

    return scroll;
  }

  animationScroll(start: number, end: number, time: number) {
    const startTime = new Date().getTime() / 1000; // ms -> s

    const tick = () => {
      const endTime = new Date().getTime() / 1000 - startTime;

      if (endTime < time) {
        this.scroll = this.moveScroll(
          start + (end - start) * easeOutExpo(endTime / time)
        );
        this.cancelAnimation = requestAnimationFrame(tick);
      } else {
        this.scroll = this.moveScroll(end);

        if (this.onSelected) {
          const element = this.listItem[this.scroll];
          const { innerHTML } = element.children[0];

          this.onSelected(innerHTML, this.scroll);
        }
        this.stopAnimation();
      }
    };
    tick();
  }

  stopAnimation() {
    cancelAnimationFrame(this.cancelAnimation);
  }

  selected(value: string | number) {
    // 값을 선택하지 않았을 경우, 첫번째 값 선택
    if (value === '') {
      this.scroll = this.moveScroll(0);
    } else {
      this.listItem.map((element, index) => {
        const el = element.children[0];

        const { innerHTML } = el;

        if (value === innerHTML) {
          const initScroll = this.scroll;
          const finalScroll = index;
          const distance = finalScroll - initScroll;
          const time = distance / this.velocity;

          this.animationScroll(initScroll, finalScroll, time);
        }
      });
    }
  }
}
