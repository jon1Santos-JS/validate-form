declare type HashFailedResponse = {
    success: false;
    data: string;
};

declare type HashResponse =
    | HashFailedResponse
    | {
          success: true;
          data: UserFromDataBase;
      };
