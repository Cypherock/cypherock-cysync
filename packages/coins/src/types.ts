export interface ICoinUnit {
  name: string;
  abbr: string;
  magnitude: number;
}

export interface ICoinInfo {
  id: string;
  name: string;
  isTest: boolean;
  coinGeckoId: string;
  coinIndex: string;
  feesUnit: string;
  family: string;
  units: ICoinUnit[];
}
