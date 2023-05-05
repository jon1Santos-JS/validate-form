declare interface MiniDBType {
    accounts: InputDataBaseType[];
    limit: number;
}

declare interface InputDataBaseType {
    username: { value: string };
    password: { value: string };
}

declare type HandleDBComandType = 'reset' | 'get' | 'create' | 'refresh';
