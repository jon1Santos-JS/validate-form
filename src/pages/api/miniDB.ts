import { readFile, unlink, writeFile } from 'fs';

export interface MiniDBType {
    accounts: InputDataBaseType[];
    limit: number;
}

export interface InputDataBaseType {
    username: { value: string };
    password: { value: string };
    timeStamp?: string;
}

let DataBase: MiniDBType = { accounts: [], limit: 20 };

export class MiniDB {
    async init() {
        await this.#accessDB();
    }

    async createAccount(userAccount: InputDataBaseType) {
        console.log('createAccount called');
        // if (!this.#checkDB(userAccount)) return;
        await this.#accessDB();
        console.log(DataBase.accounts);
        DataBase.accounts.push(userAccount);
        await this.#refreshDB();
    }

    #checkDB(userAccount: InputDataBaseType) {
        if (!DataBase) return;
        if (DataBase.limit === DataBase.accounts.length) return false;
        if (!this.#checkAccount(userAccount)) return false;
        return true;
    }

    #checkAccount(userAccount: InputDataBaseType) {
        if (!DataBase) return;
        const isThereAccount = DataBase.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        if (!isThereAccount) return true;
        return false;
    }

    async #accessDB() {
        readFile('miniDB.json', 'utf8', async (err, data) => {
            if (err) {
                await this.#refreshDB();
                return;
            }
            if (data.length > 2) DataBase = JSON.parse(data);
        });
    }

    async #refreshDB() {
        const json = JSON.stringify(DataBase, undefined, 2);
        writeFile('miniDB.json', json, async (err) => {
            if (err) return;
        });
    }

    async #deleteDB() {
        unlink('miniDB.json', (err) => {
            if (err) return;
        });
    }
}
