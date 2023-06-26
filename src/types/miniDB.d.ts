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
    password: { value: string };
}

declare interface UserToChangePasswordFromClientType
    extends UserFromClientType {
    newPassword: { value: string };
}

declare type HandleDBComandType = 'reset' | 'refresh' | 'getUsers';
