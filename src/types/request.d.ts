declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

declare interface FetchOptionsType {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: string;
}

declare interface ServerResponse {
    serverResponse: boolean;
    body: string;
}
