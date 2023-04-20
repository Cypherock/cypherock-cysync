import { IBaseRepository } from "./BaseRepository";

export enum Status {
	Pending = 0,
	Failed,
	Success,
}

export enum TransactionType {
	Receive = 0,
	Send,
	Swap,
}

export interface AddressInfo {
	address: string;
	value: string;
	amount: string;
	mine: boolean;
}

export interface ITransaction {
	id: string;
	hash: string;
	total: string;
	fees: string;
	amount: string;
	status: Status;
	type: TransactionType;
	time: string;
	blockHeight: number;
	inputs: AddressInfo[];
	outputs: AddressInfo[];
	confirmations: number;
	assetSpecificData: any;
}
export interface ITransactionRepository extends IBaseRepository<ITransaction> {
	getParent(ITransaction): Promise<ITransaction>;
	getChildren(ITransaction): Promise<ITransaction[]>;
}
