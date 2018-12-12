declare module 'kitsu' {
  type Dictionary<V> = {
    [key: string]: V;
  };
  type Headers = Dictionary<string>;

  class Kitsu {
    constructor(options: KitsuOptions);

    public delete(
      model: string,
      id: string | number,
      headers?: Headers,
    ): Promise;

    public get<Model>(
      model: string,
      params?: GetParams,
      headers?: Headers,
    ): Promise<JsonApiSuccessResponse<Model>>;

    public patch<Model>(model: string, body: Model, headers?: Headers): Promise;

    public post<Model>(model: string, body: Model, headers?: Headers): Promise;

    public self(params: SelfParams, headers?: Headers): Promise;
  }

  export interface KitsuOptions {
    baseURL?: string;
    headers?: Headers;
    camelCaseTypes?: boolean;
    resourceCase?: string;
    pluralize?: boolean;
    /**
     * In milliseconds
     */
    timeout?: number;
  }

  export interface GetParams {
    page?: {
      limit?: number;
      offset?: number;
      number?: number;
      size?: number;
    };
    fields?: Dictionary<string>;
    filter?: Dictionary<string>;
    sort?: string;
    include?: string;
  }

  export interface SelfParams {
    fields?: Dictionary<string>;
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

  export interface MetaAttributes {
    'total-records'?: number;
  }

  export interface JsonApiSuccessResponse<Model> {
    data: Model | Model[];
    meta?: MetaAttributes;
  }

  export interface JsonApiErrorResponse {
    errors: JsonApiError[];
  }

  export default Kitsu;
}
