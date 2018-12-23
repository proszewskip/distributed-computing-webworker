import Kitsu, { KitsuOptions } from 'kitsu';

import { config } from 'product-specific/config';

const defaultOptions: KitsuOptions = {
  baseURL: config.serverUrl,
  camelCaseTypes: false,
};

export type KitsuFactory = (options?: KitsuOptions) => Kitsu;

export const kitsuFactory: KitsuFactory = (options = {}) =>
  new Kitsu({ ...defaultOptions, ...options });
