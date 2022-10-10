export const easeInOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};

export const easeOutQuart = (x: number): number => {
  return 1 - Math.pow(1 - x, 4);
};

export const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};
