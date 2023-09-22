import { readFileSync, writeFileSync } from 'fs';
import {
    DATABASE,
    INITIAL_STATE,
    MINI_DB_FILE_PATH_NAME,
    SERVER_ERROR_RESPONSE,
} from './miniDB';

export default class MiniDBHandler {
    #StateFunctions = {
        checkDBState: async (caller: string) => {
            const response = await this.init('check database state');
            if (response) return SERVER_ERROR_RESPONSE;
            if (DATABASE.state.accounts.length >= DATABASE.state.limit) {
                console.log(
                    'database limit account reached, to attempted create a new account by: ',
                    caller,
                );
                return SERVER_ERROR_RESPONSE;
            }
            return;
        },
        getUsers: async (caller: string) => {
            const response = await this.init('get users');
            if (response) return response;
            console.log('Users have been gotten by: ', caller);
            return DATABASE.state.accounts;
        },
        createAndRefreshDB: async (caller: string) => {
            if (process.env.IS_LOCALHOST === 'true')
                console.log('sim está em um abiente local');
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
        accessDB: async (caller: string) => {
            try {
                const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
                DATABASE.state = JSON.parse(data);
                return;
            } catch {
                DATABASE.state = INITIAL_STATE;
                const response = await this.#StateFunctions.createAndRefreshDB(
                    caller ?? 'MiniDBHandler - accessDB',
                );
                if (response) return SERVER_ERROR_RESPONSE;
                return;
            }
        },
    };

    async init(caller: string) {
        if (process.env.IS_LOCALHOST === 'true')
            console.log('sim está em um abiente local');
        const response = await this.#StateFunctions.accessDB(caller);
        if (response) return SERVER_ERROR_RESPONSE;
    }

    handleDB<T extends HandleDBCommandTypes>(command: T) {
        return this.#StateFunctions[command];
    }
}
