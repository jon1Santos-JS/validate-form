declare type FetchOptionsType = {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: BodyInit | null;
};

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

declare type ServerResponse = {
    serverResponse: boolean;
    body: string;
};

// IMGBB API RESPONSE: https://api.imgbb.com

declare type ImgBBResponseType = {
    data: DataType;
    success: boolean;
};

declare type DataType = {
    url: string;
};
