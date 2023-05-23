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

declare type ConstraintsType = 'user';

declare type HandleDBComandType = 'reset' | 'getDB' | 'refresh' | 'getUsers';
