import { DATABASE } from '../DBState';
import DBHandler from '../DBhandler';

export default class UserAuth {
    #DB = new DBHandler();

    async authAccount(userAccount: UserFromClient) {
        const response = await this.#DB.handleDB('refreshDB', 'auth account');
        if (!response.success) return response;
        const account = DATABASE.state.accounts.find((DBAccount) =>
            DBAccount.username.value === userAccount.username.value &&
            DBAccount.password.value === userAccount.password.value
                ? DBAccount
                : undefined,
        );
        if (!account) {
            console.log('Account does not exist');
            return {
                success: false,
                data: 'Account does not exist',
            } as DBResponse;
        }
        return {
            success: true,
            data: account,
        } as DBResponse;
    }

    async authUsername(userAccount: UserFromClient) {
        const response = await this.#DB.handleDB('refreshDB', 'auth username');
        if (!response.success) return response;
        const { username } = userAccount;
        const account = DATABASE.state.accounts.find((DBAccount) => {
            if (DBAccount.username.value !== username.value) {
                return;
            }
            return DBAccount;
        });
        if (!account) {
            console.log('Account does not exist');
            return {
                success: false,
                data: 'Account does not exist',
            } as DBResponse;
        }
        return {
            success: true,
            data: account,
        } as DBResponse;
    }
}
