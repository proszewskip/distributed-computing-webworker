import Kitsu, { KitsuOptions } from 'kitsu';

import { config } from 'product-specific/config';

const defaultOptions: KitsuOptions = {
  baseURL: config.serverUrl,
  camelCaseTypes: false,
};

export type KitsuFactory = (options?: KitsuOptions) => Kitsu;

export const kitsuFactory: KitsuFactory = (options = {}) => {
  const kitsu = new Kitsu({ ...defaultOptions, ...options });

  enableSendingCookies(kitsu as any);

  return kitsu;
};

const enableSendingCookies = (kitsu: {
  axios: { defaults: { withCredentials?: boolean } };
}) => {
  kitsu.axios.defaults.withCredentials = true;
};
