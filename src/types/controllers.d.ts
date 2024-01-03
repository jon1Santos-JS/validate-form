declare type AuthUserResponse =
    | DBFailedResponse
    | {
          success: true;
          data: AuthUser;
      };

declare type AuthUser = {
    username: string;
    userImage: string;
};
