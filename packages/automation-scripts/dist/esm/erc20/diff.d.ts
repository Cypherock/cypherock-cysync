export interface Erc20ListItem {
    id: string;
    symbol: string;
    name: string;
    market_cap?: number;
    version?: string;
    platforms?: Record<string, {
        contract_address: string;
        decimal_place: number;
    } | undefined>;
    description?: {
        en?: string;
    };
    image?: {
        thumb?: string;
        small?: string;
        large?: string;
    };
    last_updated_at?: string;
    is_zero_value_coin?: boolean;
    is_custom_coin?: boolean;
}
export declare const getERC20TokenDifference: (dontSaveToFile?: boolean) => Promise<Erc20ListItem[]>;
//# sourceMappingURL=diff.d.ts.map