import { readFileSync, writeFileSync } from 'fs';
import {
    DATABASE,
    INITIAL_STATE,
    MINI_DB_FILE_PATH_NAME,
    SERVER_ERROR_RESPONSE,
} from './miniDB';

export class MiniDBHandler {
    async init() {
        const response = await this.#accessDB();
        if (response) return SERVER_ERROR_RESPONSE;
        if (this.#checkDBState()) return SERVER_ERROR_RESPONSE;
        return;
    }

    async handleDB(command: HandleDBComandType, caller?: string) {
        if (command === 'refresh')
            return await this.#createAndRefreshDB(caller);
        if (command === 'getUsers') return await this.#getUsers();
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
            console.log('DB has been accessed');
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
