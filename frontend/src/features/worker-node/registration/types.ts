export interface RegistrationServiceDependencies {
  fetch: GlobalFetch['fetch'];
}

export interface RegisterResponseBody {
  data: {
    attributes: {
      id: string;
    };
  };
}
