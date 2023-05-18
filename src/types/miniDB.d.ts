declare interface MiniDBType {
    state: MiniDBState;
}

declare interface MiniDBState {
    accounts: InputDataBaseType[];
    limit: number;
}

declare interface InputDataBaseType {
    username: { value: string };
    password: { value: string };
}

declare interface InputDataBaseTypeWithConstraint extends InputDataBaseType {
    constraint: 'user' | 'admin';
}

declare interface InputDataBaseTypeWithID
    extends InputDataBaseTypeWithConstraint {
    ID: number;
}

declare interface InputDataBaseTypeWithTimeStamp
    extends InputDataBaseTypeWithID {
    timeStamp: string;
}

declare type HandleDBComandType =
    | 'reset'
    | 'get'
    | 'create'
    | 'refresh'
    | 'getUsers';
