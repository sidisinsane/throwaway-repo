/**
 * Calculates the arithmetic mean (average) of an array of numbers.
 *
 * @param arr An array of numbers for which the mean will be calculated.
 * @returns The arithmetic mean (average) of the numbers in the array.
 * If the input array is empty, the function returns NaN (Not-a-Number).
 *
 * @example
 * const numberArray = [1, 2, 3, 4, 5];
 * const avg = mean(numberArray);
 * console.log(avg); // Output: 3
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) {
    return NaN;
  }

  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  return total / arr.length;
}

/**
 * Calculates the median value of an array of numbers.
 *
 * @param arr An array of numbers for which the median will be calculated.
 * @returns The median value of the numbers in the array.
 *
 * @example
 * const numberArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
 * const medianValue = median(numberArray);
 * console.log(medianValue); // Output: 4
 */
export function median(arr: number[]): number {
  const { length } = arr;

  arr.sort((a, b) => a - b);

  if (length % 2 === 0) {
    return (arr[length / 2 - 1] + arr[length / 2]) / 2;
  }

  return arr[(length - 1) / 2];
}

/**
 * Calculates the mode (most frequent value) of an array of numbers.
 *
 * @param arr An array of numbers for which the mode will be calculated.
 * @returns The mode (most frequent value) of the numbers in the array.
 * If the input array is empty, the function returns undefined.
 *
 * @example
 * const numberArray = [1, 2, 3, 4, 2, 3, 4, 4, 4];
 * const result = mode(numberArray);
 * console.log(result); // Output: 4
 */
export function mode(arr: number[]): number | undefined {
  const mode: { [key: number]: number } = {};
  let max: number | undefined = undefined,
    count = 0;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (mode[item]) {
      mode[item]++;
    } else {
      mode[item] = 1;
    }

    if (count < mode[item]) {
      max = item;
      count = mode[item];
    }
  }

  return max;
}

/**
 * Calculates the range (difference between the maximum and minimum values) of an array of numbers.
 *
 * @param arr An array of numbers for which the range will be calculated.
 * @returns An array containing the minimum and maximum values of the input array.
 * If the input array is empty, the function returns an array with two undefined values.
 *
 * @example
 * const numberArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
 * const result = range(numberArray);
 * console.log(result); // Output: [1, 9]
 */
export function range(arr: number[]): [number | undefined, number | undefined] {
  if (arr.length === 0) {
    return [undefined, undefined];
  }

  arr.sort((a, b) => a - b);

  return [arr[0], arr[arr.length - 1]];
}

/**
 * Finds the number in an array that is closest to a given goal number.
 *
 * @param arr An array of numbers.
 * @param goal The target number to which the closest number will be found.
 * @returns The number in the array that is closest to the given goal number.
 * If the input array is empty, the function returns undefined.
 *
 * @example
 * const numberArray = [1, 4, 6, 8, 10];
 * const goalNumber = 7;
 * const closestNumber = closest(numberArray, goalNumber);
 * console.log(closestNumber); // Output: 8
 */
export function closest(arr: number[], goal: number): number | undefined {
  if (arr.length === 0) {
    return undefined;
  }

  return arr.reduce((prev, curr) => {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });
}

/**
 * Calculates the absolute difference between two numbers.
 *
 * @param a The first number.
 * @param b The second number.
 * @returns The absolute difference between the two input numbers.
 *
 * @example
 * const numberA = 10;
 * const numberB = 5;
 * const result = difference(numberA, numberB);
 * console.log(result); // Output: 5
 */
export function difference(a: number, b: number): number {
  return Math.abs(a - b);
}
