declare interface MiniDBType {
    state: MiniDBState;
}

declare interface MiniDBState {
    accounts: UserFromDataBaseType[];
    limit: number;
}

declare interface UserFromDataBaseType {
    ID: number;
    constraint: ConstraintsType;
    username: { value: string };
    password: { value: string };
}

declare type ConstraintsType = 'user' | 'admin';

declare interface UserFromClientType {
    username: { value: string };
}

declare interface AccountFromClientType {
    username: { value: string };
    password: { value: string };
}

declare interface ChangeUsernameFromClientType {
    username: { value: string };
    newUsername: { value: string };
}

declare interface ChangePasswordFromClientType extends AccountFromClientType {
    newPassword: { value: string };
}

declare type HandleDBComandType = 'reset' | 'refresh' | 'getUsers';
