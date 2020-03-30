export function shallowMerge<T>(
  base: Partial<T>,
  ...args: Partial<T>[]
): T {
  const newObj = {};
  const mergeIn = (obj: Partial<T>) => {
    Object.keys(obj)
      .forEach((key) => newObj[key] = obj[key]);
  };
  mergeIn(base);
  args.forEach((obj) => mergeIn(obj));
  return newObj as T;
}
