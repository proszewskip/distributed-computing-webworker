import express from 'express';
import next from 'next';

import { routes } from './routes';

const port = parseInt(process.env.PORT as string, 10) || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  express()
    .use(handler)
    .listen(port, (err: any) => {
      if (err) {
        throw err;
      }

      // tslint:disable-next-line:no-console
      console.log(`Ready on http://localhost:${port}`);
    });
});
