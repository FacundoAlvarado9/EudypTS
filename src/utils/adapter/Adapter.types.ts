import type { ComparisonResult } from "../TSCompare";

export type AdaptedResult = {
    status : "Success" | "Error";
    errorMessage? : any;
    result ?: ComparisonResult;
}