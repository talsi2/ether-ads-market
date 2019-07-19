
/**
 *  returns a promise and pointers to its callback functions
 */
export const flatPromise = () => {
  let resolve = (x: any): any => x, reject = (x: any): any => x;
  const promise: Promise<any> = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

/**
 * @param ms time period in milliseconds
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
