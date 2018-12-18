/**
 * Returns keys of properties that are not `never`
 */
type ExtractNonNeverPropertyKeys<T> = ({
  [P in keyof T]: T[P] extends never ? never : P
})[keyof T];

/**
 * Returns an object with properties that are not `never`
 */
export type ExtractNonNeverProperties<T> = Pick<
  T,
  ExtractNonNeverPropertyKeys<T>
>;
