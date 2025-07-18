import { Notifier, LLM, Context, Crypto, JSON, HTTP, HttpRequest, Ledger } from "@klave/sdk/assembly";
import {FetchInput, FetchOutput, StoreInput, StoreOutput, ErrorMessage, Notification} from "./types";

const myTableName = "my_storage_table";

/**
 * @query
 * @param {FetchInput} input - A parsed input argument
 */
export function fetchValue(input: FetchInput): void {
    
    Notifier.sendJson<Notification>({
        notify: 'coooie'
    });


    let value = Ledger.getTable(myTableName).get(input.key);
    if (value.length === 0) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: `key '${input.key}' not found in table`
        });
    } else {
        Notifier.sendJson<FetchOutput>({
            success: true,
            value
        });
    }
}

/**
 * @transaction
 * @param {StoreInput} input - A parsed input argument
 */
export function storeValue(input: StoreInput): void {

    if (input.key && input.value) {
        Ledger.getTable(myTableName).set(input.key, input.value);
        Notifier.sendJson<StoreOutput>({
            success: true
        });
        return;
    }

    Notifier.sendJson<ErrorMessage>({
        success: false,
        message: `Missing value arguments`
    });
}



/**
 * @transaction
 * @param {StoreInput} input - A parsed input argument
 */
export function generate(): void {
    const query: HttpRequest = {
        hostname: 'http://195.49.74.29:8002',
        port: 443,
        method: 'post',
        path: '/generate',
        version: '1.1',
        headers: [['Content-Type', 'application/json']],
        body: `{
                    "prompt": "Explain containerization:",
                    "max_tokens": 100
                }
                `
    };

    Notifier.sendJson<HttpRequest>(
        query
    );

    const response = HTTP.request(query);
    if (!response) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: `HTTP call went wrong !`
        });
        return;
    }

    Notifier.sendJson<Notification>({
        notify: response.body
    });
}