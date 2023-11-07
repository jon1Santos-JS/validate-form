import { DATABASE } from '../DBState';
import DBHandler from '../DBhandler';
import UserAuth from './Auth';

export default class DBAccountHandler {
    #DB = new DBHandler();
    #AUTH = new UserAuth();

    async signIn(userAccount: UserFromClient) {
        return await this.#AUTH.authAccount(userAccount);
    }

    async signUp(userAccount: UserFromClient) {
        const checkDBResponse = await this.#DB.handleDB(
            'checkDBState',
            'create account',
        );
        if (!checkDBResponse.success) return checkDBResponse;
        const authResponse = await this.#AUTH.authUsername(userAccount);
        if (!authResponse.success) return authResponse;
        return await this.#signUp(userAccount);
    }

    async #signUp(userAccount: UserFromClient) {
        const userAccountHandled: UserFromDataBase =
            onAddInputFields(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB('refreshDB', 'create account');
        if (!response.success) return response;
        return {
            success: true,
            data: 'Account has been created',
        } as DBResponse;
    }

    async deleteAccount(userAccount: UserFromClient) {
        DATABASE.state.accounts = DATABASE.state.accounts.filter(
            (DBAccount) =>
                DBAccount.username.value !== userAccount.username.value,
        );
        const response = await this.#DB.handleDB('refreshDB', 'delete account');
        if (!response.success) return response;
        return {
            success: true,
            data: 'Account has been deleted',
        } as DBResponse;
    }
}

function onAddInputFields(userAccount: UserFromClient) {
    const handledUserAccount = {
        ID: DATABASE.state.accounts.length.toString(),
        constraint: 'user',
        ...userAccount,
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    };
    return handledUserAccount as UserFromDataBase;
}
