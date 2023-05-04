import { readFileSync, unlink, writeFileSync } from 'fs';

const initialState = { accounts: [], limit: 20 };
const miniDbFileName = 'miniDBFile.json';

export interface MiniDBType {
    accounts: InputDataBaseType[];
    limit: number;
}

export interface InputDataBaseType {
    username: { value: string };
    password: { value: string };
    timeStamp?: string;
}

let DataBase: MiniDBType = initialState;

export class MiniDB {
    async init() {
        await this.#accessDB();
    }

    async createAccount(userAccount: InputDataBaseType) {
        if (!this.#authAccount(userAccount)) return;
        await this.#accessDB();
        DataBase.accounts.push(userAccount);
        await this.#createAndRefreshDB();
    }

    #authAccount(userAccount: InputDataBaseType) {
        if (DataBase.limit === DataBase.accounts.length) return false;
        const account = DataBase.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        if (!account) return true;
        return false;
    }

    async #accessDB() {
        try {
            const data = await readFileSync(miniDbFileName, 'utf8');
            DataBase = JSON.parse(data);
        } catch {
            DataBase = initialState;
            await this.#createAndRefreshDB();
        }
    }

    async #createAndRefreshDB() {
        const json = JSON.stringify(DataBase, undefined, 2);
        try {
            await writeFileSync(miniDbFileName, json);
        } catch {
            console.log('failed to refresh file');
        }
    }

    async #deleteDB() {
        unlink(miniDbFileName, (err) => {
            if (err) return;
        });
    }
}
