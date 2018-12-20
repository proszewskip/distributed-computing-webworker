import fetch from 'isomorphic-unfetch';

export interface RegistrationServiceDependencies {
  fetch: typeof fetch;
}

export interface RegisterResponseBody {
  data: {
    attributes: {
      id: string;
    };
  };
}
