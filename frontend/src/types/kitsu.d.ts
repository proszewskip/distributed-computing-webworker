declare module 'kitsu' {
  class Kitsu<Model> {
    constructor(options: KitsuOptions);

    public delete(
      model: string,
      id: string | number,
      headers?: Object,
    ): Promise;

    public get(
      model: string,
      params?: GetParams,
      headers?: object,
    ): Promise<JsonApiResponse<Model>>;

    public patch(model: string, body: Model, headers?: Object): Promise;

    public post(model: string, body: Model, headers?: Object): Promise;

    public self(params: SelfParams, headers?: object): Promise;
  }

  interface KitsuOptions {
    baseURL?: string;
    headers?: object;
    camelCaseTypes?: boolean;
    resourceCase?: boolean;
    pluralize?: boolean;
    timeout?: number;
  }

  interface GetParams {
    page?: {
      limit: number;
      offset: number;
    };
    field?: object;
    filter?: object;
    sort?: string;
    include?: string;
  }

  interface SelfParams {
    fields?: object;
    include?: string;
  }

  export interface JsonApiError {
    id?: number;
    links?: object;
    status?: number;
    code?: number;
    title?: string;
    detail?: string;
    source?: object;
    meta?: object;
  }

  export interface JsonApiResponse<Model> {
    data: Model;
    errors: JsonApiError[];
  }

  export default Kitsu;
}
