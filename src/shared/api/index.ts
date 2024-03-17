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
    return await response.json();
  }
}

type TCatFactGetResponse = {
  fact: string;
};
class CatFactApiClient extends ApiClient {
  async getFact(): Promise<TCatFactGetResponse> {
    return (await super.get()) as TCatFactGetResponse;
  }
}

type TAgeByNameResponse = {
  age: number | null;
};
class AgeByNameApiClient extends ApiClient {
  async getAge(name: string, abortSignal: AbortSignal): Promise<TAgeByNameResponse> {
    return (await super.get({ name }, abortSignal)) as TAgeByNameResponse;
  }
}

export const catFactApiClient = new CatFactApiClient("https://catfact.ninja/fact");
export const ageByNameApiClient = new AgeByNameApiClient("https://api.agify.io");