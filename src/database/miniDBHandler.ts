import { readFileSync, writeFileSync } from 'fs';
import { DataBase, INITIAL_STATE, MINI_DB_FILE_PATH_NAME } from './miniDB';

export class MiniDBHandler {
    async init() {
        await this.#accessDB();
        if (!this.#checkDBState()) return 'internal server error';
    }

    async handleDB(comand: HandleDBComandType, caller?: string) {
        if (comand === 'reset') return this.#resetDB();
        if (comand === 'get') return this.#returnDB();
        if (comand === 'refresh') return this.#createAndRefreshDB(caller);
        if (comand === 'getUsers') return this.#getUsers();
    }

    async #getUsers() {
        await this.#accessDB();
        return DataBase.state.accounts;
    }

    async #accessDB() {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DataBase.state = JSON.parse(data);
        } catch {
            DataBase.state = INITIAL_STATE;
            return await this.#createAndRefreshDB('MiniDB - accessDB');
        }
    }

    async #returnDB() {
        await this.#accessDB();
        return JSON.stringify(DataBase.state, undefined, 2);
    }

    async #resetDB() {
        DataBase.state = INITIAL_STATE;
        const json = JSON.stringify(DataBase.state, undefined, 2);
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
        if (!this.#checkDBState()) return 'internal server error';
        const json = JSON.stringify(DataBase.state, undefined, 2);
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

    #checkDBState() {
        if (DataBase.state.accounts.length > DataBase.state.limit) {
            console.log('database limit account reached');
            return false;
        }
        return true;
    }
}
