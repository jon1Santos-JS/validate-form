declare type MiniDBType<T> = {
    state: MiniDBState<T>;
};

declare type MiniDBState<T> = {
    _id: T;
    accounts: UserFromDataBase[];
    limit: number;
};

declare type UserFromDataBase = {
    ID: string;
    constraint: Constraints;
    username: { value: string };
    password: { value: string };
    userImage: string;
};

declare type Constraints = 'user' | 'admin';

declare type HandleDBCommand =
    | 'resetDB'
    | 'getUsers'
    | 'checkDBState'
    | 'refreshDB';

declare type DBFailedResponse = {
    success: false;
    data: string;
};

declare type DBDefaultResponse =
    | DBFailedResponse
    | {
          success: true;
      };

declare type DBGetUsersResponse =
    | DBFailedResponse
    | {
          success: true;
          data: UserFromDataBase[];
      };

declare type DBHashResponse =
    | DBFailedResponse
    | {
          success: true;
          data: UserFromDataBase;
      };

declare interface UserFromClient {
    username: { value: string };
    password: { value: string };
}

declare interface UserWithNewPassword extends UserFromClient {
    newPassword: { value: string };
}

declare interface UserWithNewUsername extends UserFromClient {
    newUsername: { value: string };
}

declare interface UserWithImage extends UserFromClient {
    newImage: { value: string };
}

declare type NewUserImage = {
    value: string;
};
