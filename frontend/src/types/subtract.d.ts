import { Omit } from './omit';

export type Subtract<T, P> = Omit<T, keyof P>;
