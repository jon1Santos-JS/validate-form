import { readFileSync, writeFileSync } from 'fs';

const INITIAL_STATE = { accounts: [], limit: 10 };
const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';

export let DataBase: MiniDBType = INITIAL_STATE;

export class MiniDB {
    async init() {
        await this.#accessDB();
        if (!this.#checkDB()) return 'internal server error';
    }

    async handleDB(comand: HandleDBComandType, caller?: string) {
        if (comand === 'reset') return this.#resetDB();
        if (comand === 'get') return this.#returnDB();
        if (comand === 'refresh') return this.#createAndRefreshDB(caller);
    }

    async #accessDB() {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DataBase = JSON.parse(data);
        } catch {
            DataBase = INITIAL_STATE;
            return await this.#createAndRefreshDB('MiniDB - accessDB');
        }
    }

    async #returnDB() {
        await this.#accessDB();
        return JSON.stringify(DataBase, undefined, 2);
    }

    async #resetDB() {
        DataBase = INITIAL_STATE;
        const json = JSON.stringify(DataBase, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('The DataBase has been reset');
            return 'The DataBase has been reset';
        } catch {
            console.log('DB file was not found');
            return 'internal server error';
        }
    }

    async #createAndRefreshDB(caller?: string) {
        if (!this.#checkDB()) return 'internal server error';
        const json = JSON.stringify(DataBase, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('DB has been created or refreshed');
        } catch {
            console.log(
                'failed to create or refresh file by: ',
                caller && caller,
            );
            return 'internal server error';
        }
    }

    #checkDB() {
        if (DataBase.limit === DataBase.accounts.length) {
            console.log('database limit account reached');
            return false;
        }
        return true;
    }
}
