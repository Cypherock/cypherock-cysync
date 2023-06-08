export interface IRoute {
  name: string;
  path: string;
}

export type InternalRoute = Record<string, IRoute>;

export type Routes = Record<string, IRoute | InternalRoute>;
