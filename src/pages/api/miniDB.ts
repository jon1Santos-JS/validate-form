import { readFileSync, writeFileSync } from 'fs';

const INITIAL_STATE = { accounts: [], limit: 20 };
const MINI_DB_FILE_NAME = 'miniDBFile.json';

export interface MiniDBType {
    accounts: InputDataBaseType[];
    limit: number;
}

export interface InputDataBaseType {
    username: { value: string };
    password: { value: string };
    timeStamp?: string;
}

let DataBase: MiniDBType = INITIAL_STATE;

export class MiniDB {
    async init() {
        await this.#accessDB();
    }

    async createAccount(userAccount: InputDataBaseType) {
        if (DataBase.limit === DataBase.accounts.length) return false;
        if (this.#authAccount(userAccount)) return 'account already exist';
        DataBase.accounts.push(createTimeStamp(userAccount));
        await this.#createAndRefreshDB('createAccount');
        return 'account has been created';
    }

    logIn(userAccount: InputDataBaseType) {
        if (!this.#authAccount(userAccount)) return;
        const account = DataBase.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        return JSON.stringify(account, undefined, 2);
    }

    #authAccount(userAccount: InputDataBaseType) {
        const account = DataBase.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        if (!account) return false;
        return true;
    }

    async #accessDB() {
        try {
            const data = await readFileSync(MINI_DB_FILE_NAME, 'utf8');
            DataBase = JSON.parse(data);
        } catch {
            DataBase = INITIAL_STATE;
            await this.#createAndRefreshDB('accessDB');
        }
    }

    async returnDB() {
        await this.#accessDB();
        return DataBase;
    }

    async #createAndRefreshDB(caller?: string) {
        const json = JSON.stringify(DataBase, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_NAME, json);
        } catch {
            console.log(
                'failed to create or refresh file by: ',
                caller && caller,
            );
        }
    }
}

function createTimeStamp(userAccount: InputDataBaseType) {
    const todaysDate = new Date();
    const todaysDateFormated = todaysDate
        .toLocaleString()
        .split(', ')
        .join('-');
    const accountWithTimeStamp = {
        ...userAccount,
        timeStamp: todaysDateFormated,
    };

    return accountWithTimeStamp;
}
