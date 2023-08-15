import { readFileSync, writeFileSync } from 'fs';
import {
    DATABASE,
    INITIAL_STATE,
    MINI_DB_FILE_PATH_NAME,
    SERVER_ERROR_RESPONSE,
} from './miniDB';

export default class MiniDBHandler {
    #PrivateFunctions = {
        getUsers: async () => {
            const response = await this.#accessDB();
            if (response) return SERVER_ERROR_RESPONSE;
            return DATABASE.state.accounts;
        },
        createAndRefreshDB: async (caller: string) => {
            const json = JSON.stringify(DATABASE.state, undefined, 2);
            try {
                await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
                console.log('DB has been created or refreshed by: ', caller);
                return;
            } catch {
                console.log('failed to create or refresh file by: ', caller);
                return SERVER_ERROR_RESPONSE;
            }
        },
    };

    async init() {
        const response = await this.#accessDB();
        if (response) return SERVER_ERROR_RESPONSE;
        if (this.#checkDBState()) return SERVER_ERROR_RESPONSE;
        return;
    }

    async handleDB<T extends HandleDBCommandTypes>(command: T) {
        return this.#PrivateFunctions[command];
    }

    async #accessDB() {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DATABASE.state = JSON.parse(data);
            return;
        } catch {
            if (DATABASE.state.accounts.length <= 1) return;
            DATABASE.state = INITIAL_STATE;
            const response = await this.#PrivateFunctions.createAndRefreshDB(
                'MiniDBHandler - accessDB',
            );
            if (response) return SERVER_ERROR_RESPONSE;
            return;
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
