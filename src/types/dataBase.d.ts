declare interface MiniDBType<T> {
    state: MiniDBState<T>;
}

declare interface MiniDBState<T> {
    _id: T;
    accounts: UserFromDataBaseType[];
    limit: number;
}

declare interface UserFromDataBaseType {
    ID: string;
    constraint: ConstraintsType;
    username: { value: string };
    password: { value: string };
    userImage: string;
}

declare type ConstraintsType = 'user' | 'admin';

declare interface UserFromClientType {
    username: { value: string };
}

declare interface UserFromClientType {
    username: { value: string };
    password: { value: string };
}

declare interface ChangeUsernameFromClientType {
    username: { value: string };
    newUsername: { value: string };
}

declare interface ChangePasswordFromClientType extends UserFromClientType {
    newPassword: { value: string };
}

declare interface UserWithImgType {
    userName: string;
    userImg: string;
}

declare type HandleDBCommandTypes =
    | 'createAndRefreshDB'
    | 'getUsers'
    | 'checkDBState';
