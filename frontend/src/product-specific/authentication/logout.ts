import unfetch from 'isomorphic-unfetch';

export const logout = (fetch: typeof unfetch) =>
  fetch('/users/logout', {
    method: 'POST',
  }).catch(() => null);
