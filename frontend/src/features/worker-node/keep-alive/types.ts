import fetch from 'isomorphic-unfetch';

export interface KeepAliveServiceDependencies {
  fetch: typeof fetch;
}
