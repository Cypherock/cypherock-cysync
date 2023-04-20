import { AddressInfo } from "../entities/Transaction";

export interface HistoryItemInfo {
	accountName: string;
	walletName: string;
	assetName: string;
	assetSymbol: string;
	value: string; // balance in USD
	amount: string; // balance in asset's currency
	time: "string"; // Human readable format
	transactionType: "receive" | "send" | "swap";
	status: "success" | "failed" | "pending";
	sender: AddressInfo[];
	receiver: AddressInfo[];
	extraInfo: Record<string, string>; // Need something like this to display details for specific coins
	// Swap UI may be different, we might want to update this accordingly
}
