export declare enum ServerErrorType {
    UNKNOWN_ERROR = "SER_0000",
    CONNOT_CONNECT = "SER_0001"
}
type CodeToErrorMap = {
    [property in ServerErrorType]: {
        message: string;
    };
};
export declare const serverErrorTypeDetails: CodeToErrorMap;
export interface ServerErrorDetails {
    advanceText?: string;
    responseBody?: any;
    url?: string;
    status?: number;
}
export declare class ServerError extends Error {
    code: string;
    message: string;
    details?: ServerErrorDetails;
    isServerError: boolean;
    constructor(errorCode: ServerErrorType, message?: string, details?: ServerErrorDetails);
    toJSON(): {
        stack: string | undefined;
        advanceText?: string | undefined;
        responseBody?: any;
        url?: string | undefined;
        status?: number | undefined;
        isServerError: boolean;
        code: string;
        message: string;
    };
}
export {};
//# sourceMappingURL=serverError.d.ts.map