import Kitsu, { KitsuOptions } from 'kitsu';

import { config } from 'product-specific/config';

const defaultOptions: KitsuOptions = {
  baseURL: config.serverUrl,
};

export const kitsuFactory = (options: KitsuOptions = {}) =>
  new Kitsu({ ...defaultOptions, ...options });
