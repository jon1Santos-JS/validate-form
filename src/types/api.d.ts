declare type FetchOptionsType = {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: BodyInit | null;
};

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

// IMGBB API RESPONSE: https://api.imgbb.com

declare type ImgBBResponseType =
    | {
          success: true;
          data: DataType;
      }
    | { success: false; data: string };

declare type DataType = {
    url: string;
};
