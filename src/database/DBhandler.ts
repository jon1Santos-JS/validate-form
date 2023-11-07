import { JsonDB } from './DBJson';
import { MongoDB } from './DBMongo';
import { DATABASE, DEFAULT_ERROR, INITIAL_STATE } from './DBState';

export default class DBHandler {
    #DB = process.env.IS_LOCALHOST === 'true' ? new JsonDB() : new MongoDB();

    async #refreshDB(caller: string) {
        const response = await this.#DB.refreshState('check database state');
        if (!response.success) return response;
        console.log('Database has been refreshed by:', caller);
        return {
            success: true,
        } as DBDefaultResponse;
    }

    async #checkDBState(caller: string) {
        const response = await this.#DB.accessState('check database state');
        if (!response.success) return response;
        if (DATABASE.state.accounts.length >= DATABASE.state.limit) {
            console.log(
                'database limit account reached, to attempted create a new account by: ',
                caller,
            );
            return {
                success: false,
                data: 'Database limit account reached',
            } as DBDefaultResponse;
        }
        return {
            success: true,
        } as DBDefaultResponse;
    }

    async #resetDB(caller: string) {
        DATABASE.state = INITIAL_STATE;
        const response = await this.#DB.refreshState('reset database');
        if (!response.success) return response;
        console.log('Database has been reset by:', caller);
        return {
            success: true,
        } as DBDefaultResponse;
    }

    async #getUsers(caller: string) {
        const response = await this.#DB.accessState('get users state');
        if (!response.success) return response;
        console.log('Users have been gotten by:', caller);
        return {
            success: true,
            data: DATABASE.state.accounts,
        } as DBDefaultResponse;
    }

    async handleDB<T extends HandleDBCommand>(command: T, caller: string) {
        switch (command) {
            case 'getUsers': {
                return await this.#getUsers(caller);
            }
            case 'resetDB': {
                return await this.#resetDB(caller);
            }
            case 'checkDBState': {
                return await this.#checkDBState(caller);
            }
            case 'refreshDB': {
                return await this.#refreshDB(caller);
            }
            default: {
                return {
                    success: false,
                    data: DEFAULT_ERROR,
                } as DBDefaultResponse;
            }
        }
    }
}
