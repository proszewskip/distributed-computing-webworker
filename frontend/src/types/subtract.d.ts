import { Omit } from './omit';

/**
 * Returns the difference of two types (T - P).
 */
export type Subtract<T, P> = Omit<T, keyof P>;
