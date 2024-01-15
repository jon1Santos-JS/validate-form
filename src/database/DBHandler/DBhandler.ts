import { JsonDB } from './DBJson';
import { MongoDB } from './DBMongo';
import { DATABASE, INITIAL_STATE } from './DBState';
import { compareSyncBcrypt } from '@/lib/bcryptAdapter';

const HASH_DEFAULT_ERROR = 'invalid hash';
const USER_HASH_ERROR = 'User was not found by hash';

export default class DBHandler {
    #DB = process.env.IS_LOCALHOST === 'true' ? new JsonDB() : new MongoDB();

    async connect(caller: string) {
        const response = await this.#DB.accessState(caller);
        if (!response.success) return response;
        return {
            success: true,
        } as DBDefaultResponse;
    }

    async refreshDB(caller: string) {
        const response = await this.#DB.refreshState(caller);
        if (!response.success) return response;
        return {
            success: true,
        } as DBDefaultResponse;
    }
    async checkDB(caller: string) {
        const response = await this.#DB.accessState(caller);
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
    async resetDB(constraint: Constraints, caller: string) {
        if (constraint !== 'admin')
            return {
                success: false,
                data: 'permission denied',
            };
        DATABASE.state = INITIAL_STATE;
        const response = await this.#DB.refreshState(caller);
        if (!response.success) return response;
        console.log('Database has been reset by:', caller);
        return {
            success: true,
        } as DBDefaultResponse;
    }

    async getUserByHash(browserHash: string | undefined, caller: string) {
        const getUsersReponse = await this.#getUsers(caller);
        if (!getUsersReponse.success) return getUsersReponse;
        const response = {
            success: false,
            data: HASH_DEFAULT_ERROR,
        } as DBHashResponse;
        if (!browserHash) {
            return response;
        }
        const users = getUsersReponse.data;
        users.forEach((user) => {
            const userToCompare = {
                username: user.username,
                password: user.password,
            };
            if (compareSyncBcrypt(JSON.stringify(userToCompare), browserHash)) {
                response.success = true;
                response.data = user;
            }
        });
        if (!response.success) return { ...response, data: USER_HASH_ERROR };
        return response;
    }

    async #getUsers(caller: string) {
        const response = await this.#DB.accessState(caller);
        if (!response.success) return response;
        console.log('Users have been gotten by:', caller);
        return {
            success: true,
            data: DATABASE.state.accounts,
        } as DBGetUsersResponse;
    }
}
