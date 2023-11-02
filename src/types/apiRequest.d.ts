declare type FetchOptionsType = {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: BodyInit | null;
};

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

// NEXT API RESPONSE

declare type ServerResponse = {
    serverResponse: boolean;
    body: string;
};

declare type ImageUpdateServerResponse =
    | {
          success: true;
          data: UserWithImgType;
      }
    | {
          success: false;
          data: string;
      };

// IMGBB API RESPONSE: https://api.imgbb.com

declare type ImgBBResponse = {
    success: boolean;
    data: DataType;
};

declare type DataType = {
    url: string;
};
