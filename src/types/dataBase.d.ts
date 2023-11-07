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

declare type DBAuthResponse =
    | DBFailedResponse
    | {
          success: true;
          data: UserFromDataBase;
      };

// DATA FROM CLIENT

declare type UserFromClient = {
    username: { value: string };
    password: { value: string };
};

declare type NewUsernameFromClient = {
    value: string;
};

declare type NewPasswordFromClient = {
    value: string;
};

declare type NewUserImage = {
    value: string;
};
