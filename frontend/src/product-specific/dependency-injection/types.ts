import unfetch from 'isomorphic-unfetch';
import Kitsu from 'kitsu';

export interface BaseDependencies {
  kitsu: Kitsu;
  fetch: typeof unfetch;
}
