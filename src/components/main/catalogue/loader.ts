import { IApiResponse } from '../interface/Iproducts';

export class Loader {
  baseLink: string;

  constructor(baseLink: string) {
    this.baseLink = baseLink;
  }

  async fetchData(url: string) {
    let retryCount = 5;
    return fetch(url)
      .then((res: Response) => {
        if (!res.ok && retryCount > 1) {
          retryCount -= 1;
          return fetch(url);
        }
        return res;
      })
      .then((res: Response) => res.json())
      .then((data: IApiResponse): IApiResponse => data)
      .catch((error: Error) => {
        throw new Error(`Something went wrong: ${error}`);
      });
  }
}
