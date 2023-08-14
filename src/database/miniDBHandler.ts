import { readFileSync, writeFileSync } from 'fs';
import {
    DATABASE,
    INITIAL_STATE,
    MINI_DB_FILE_PATH_NAME,
    SERVER_ERROR_RESPONSE,
} from './miniDB';

export default class MiniDBHandler {
    async init() {
        const response = await this.#accessDB();
        if (response) return SERVER_ERROR_RESPONSE;
        if (this.#checkDBState()) return SERVER_ERROR_RESPONSE;
        return;
    }

    async handleDB<T extends HandleDBComandType>(command: T, caller?: string) {
        const returnedFunctions = {
            refresh: await this.#createAndRefreshDB(caller),
            getUsers: await this.#getUsers(),
        } as const;

        return returnedFunctions[command];
    }

    async #getUsers() {
        const response = await this.#accessDB();
        if (response) return SERVER_ERROR_RESPONSE;
        return DATABASE.state.accounts;
    }

    async #accessDB() {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DATABASE.state = JSON.parse(data);
            return;
        } catch {
            DATABASE.state = INITIAL_STATE;
            const response = await this.#createAndRefreshDB(
                'MiniDBHandler - accessDB',
            );
            if (response) return SERVER_ERROR_RESPONSE;
            return;
        }
    }

    async #createAndRefreshDB(caller?: string) {
        const json = JSON.stringify(DATABASE.state, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('DB has been created or refreshed');
            return;
        } catch {
            console.log(
                'failed to create or refresh file by: ',
                caller && caller,
            );
            return SERVER_ERROR_RESPONSE;
        }
    }

    #checkDBState() {
        if (DATABASE.state.accounts.length > DATABASE.state.limit) {
            console.log('database limit account reached');
            return SERVER_ERROR_RESPONSE;
        }
        return;
    }
}
