/**
 * Returns the initial type with some keys omitted (not present in the returned type).
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
