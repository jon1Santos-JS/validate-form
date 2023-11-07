import { DATABASE } from '../DBState';

export default class UserAuthHandler {
    async authAccount(userAccount: UserFromClient) {
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
            } as DBAuthResponse;
        }
        return {
            success: true,
            data: account,
        } as DBAuthResponse;
    }

    async authUsername(userAccount: UserFromClient) {
        const account = DATABASE.state.accounts.find((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? DBAccount
                : undefined,
        );
        if (!account) {
            console.log('Account does not exist');
            return {
                success: false,
                data: 'Account does not exist',
            } as DBAuthResponse;
        }
        return {
            success: true,
            data: account,
        } as DBAuthResponse;
    }
}
