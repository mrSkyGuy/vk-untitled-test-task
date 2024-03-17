type TQueryParams = null | { [key: string]: string };

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private concatURLWithParams(queryParams: Exclude<TQueryParams, null>): string {
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams(queryParams).toString();
    return url.toString();
  }

  async get(
    queryParams: TQueryParams = null,
    abortSignal: AbortSignal | null = null
  ): Promise<unknown> {
    const response = await fetch(
      queryParams ? this.concatURLWithParams(queryParams) : this.baseUrl,
      { signal: abortSignal }
    );
    if (!response.ok) {
      throw new Error("Something gone wrong");
    }
    return await response.json();
  }
}

class CatFactApiClient extends ApiClient {
  constructor() {
    super("https://catfact.ninja/fact");
  }

  async getFact(): Promise<TCatFactGetResponse> {
    return (await super.get()) as TCatFactGetResponse;
  }
}

class AgeByNameApiClient extends ApiClient {
  constructor() {
    super("https://api.agify.io");
  }

  async getAge(name: string, abortSignal: AbortSignal): Promise<TAgeByNameResponse> {
    return (await super.get({ name }, abortSignal)) as TAgeByNameResponse;
  }
}

export const catFactApiClient = new CatFactApiClient();
export const ageByNameApiClient = new AgeByNameApiClient();
