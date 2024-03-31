import { Exceptions } from "./exceptions";
import { Metadata } from "./metadata";

export class ApiResult<T> {
    statusCode: number;
    isSuccessful: boolean;
    exceptions: Exceptions[] | null;
    Metadatas: Metadata[] | null;
    message: T | null;
}
