import { readFileSync, writeFileSync } from 'fs';
import {
    DATABASE,
    INITIAL_STATE,
    MINI_DB_FILE_PATH_NAME,
    MONGODB,
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
        },
        resetDB: async (caller: string) => {
            const response = await this.init('reset database state');
            if (response) return SERVER_ERROR_RESPONSE;
            DATABASE.state = INITIAL_STATE;
            const refreshResponse =
                await this.#StateFunctions.createAndRefreshDB('reset database');
            if (refreshResponse) return refreshResponse;
            console.log('Database has been reseted by:', caller);
        },
        getUsers: async (caller: string) => {
            const response = await this.init('get users');
            if (response) return response;
            console.log('Users have been gotten by:', caller);
            return DATABASE.state.accounts;
        },
        createAndRefreshDB: async (caller: string) => {
            if (process.env.IS_LOCALHOST !== 'true')
                return await MONGO_HANDLER.refresh(caller);
            return await JSON_HANDLER.createAndRefresh(caller);
        },
        accessDB: async (caller: string) => {
            if (process.env.IS_LOCALHOST !== 'true')
                return await MONGO_HANDLER.access(caller);
            return await JSON_HANDLER.access(caller);
        },
    };

    async init(caller: string) {
        const response = await this.#StateFunctions.accessDB(caller);
        if (response) return SERVER_ERROR_RESPONSE;
    }

    handleDB<T extends HandleDBCommandTypes>(command: T) {
        return this.#StateFunctions[command];
    }
}

const MONGO_HANDLER = {
    access: async (caller: string) => {
        try {
            await MONGODB.connect();
            const collection = MONGODB.db('accounts').collection('users');
            const databaseState = await collection.find({}).toArray();
            if (databaseState.length === 0) {
                const response = await MONGO_HANDLER.create(caller);
                if (response) return SERVER_ERROR_RESPONSE;
                DATABASE.state = INITIAL_STATE;
                return;
            }
            DATABASE.state = databaseState[0] as MiniDBState<
                (typeof databaseState)[0][0]
            >;
            console.log('Mongo Database has been accessed by:', caller);
        } catch {
            console.log('Failed to access Mongo Database by:', caller);
            return SERVER_ERROR_RESPONSE;
        } finally {
            await MONGODB.close();
        }
    },
    refresh: async (caller: string) => {
        try {
            await MONGODB.connect();
            const collection = MONGODB.db('accounts').collection('users');
            const update = {
                $set: {
                    accounts: DATABASE.state.accounts,
                },
            };
            await collection.updateMany({}, update);
            console.log('Mongo DB has been refreshed by:', caller);
        } catch {
            console.log('failed to refresh Mongo DB by:', caller);
            return SERVER_ERROR_RESPONSE;
        }
    },
    create: async (caller: string) => {
        try {
            await MONGODB.connect();
            const collection = MONGODB.db('accounts').collection('users');
            const initialState = {
                accounts: INITIAL_STATE.accounts,
                limit: INITIAL_STATE.limit,
            };
            await collection.insertMany([initialState]);
            console.log('Mongo DB has been created by:', caller);
        } catch {
            console.log('failed to create Mongo DB by:', caller);
            return SERVER_ERROR_RESPONSE;
        }
    },
};

const JSON_HANDLER = {
    access: async (caller: string) => {
        try {
            const data = await readFileSync(MINI_DB_FILE_PATH_NAME, 'utf8');
            DATABASE.state = JSON.parse(data);
            console.log('Json Database has been accessed by:', caller);
            return;
        } catch {
            DATABASE.state = INITIAL_STATE;
            const response = await JSON_HANDLER.createAndRefresh(caller);
            if (response) return SERVER_ERROR_RESPONSE;
        }
    },
    createAndRefresh: async (caller: string) => {
        const json = JSON.stringify(DATABASE.state, undefined, 2);
        try {
            await writeFileSync(MINI_DB_FILE_PATH_NAME, json);
            console.log('Json DB has been created or refreshed by:', caller);
        } catch {
            console.log('failed to create or refresh Json DB by:', caller);
            return SERVER_ERROR_RESPONSE;
        }
    },
};
