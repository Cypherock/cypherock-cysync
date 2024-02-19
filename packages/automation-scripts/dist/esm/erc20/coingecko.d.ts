export interface CoingeckoCoinListItem {
    id: string;
    symbol: string;
    name: string;
    platforms?: Record<string, string | undefined>;
}
export interface CoingeckoCoinDetails {
    id: string;
    symbol: string;
    name: string;
    detail_platforms?: Record<string, {
        decimal_place: number;
        contract_address: string;
    }>;
    market_data?: {
        market_cap?: {
            usd?: number;
        };
    };
    description?: {
        en?: string;
    };
    image?: {
        thumb?: string;
        small?: string;
        large?: string;
    };
    last_updated?: string;
}
export declare const getCoingeckoCoinList: () => Promise<CoingeckoCoinListItem[]>;
export declare const getCoingeckoCoinDetails: (id: string) => Promise<CoingeckoCoinDetails>;
export declare const coingeckoPlatformMapping: Record<string, string | undefined>;
export declare const coingeckoPlatformReverseMapping: Record<string, string | undefined>;
//# sourceMappingURL=coingecko.d.ts.map