import { ServerResponse } from 'http';

import { Redirect } from './types';

export const serverSideRedirectFactory = (res: ServerResponse): Redirect => (
  url,
) => {
  res.writeHead(302, {
    Location: url,
  });
  res.end();
};
