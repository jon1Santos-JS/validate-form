import { DATABASE } from '../DBHandler/DBState';

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
            } as DBDefaultResponse;
        }
        return {
            success: true,
            data: 'Account does not exist',
        } as DBDefaultResponse;
    }

    async authUsername(username: string) {
        const account = DATABASE.state.accounts.find((DBAccount) =>
            DBAccount.username.value === username ? DBAccount : undefined,
        );
        if (!account) {
            console.log('Account does not exist');
            return {
                success: false,
                data: 'Account does not exist',
            } as DBDefaultResponse;
        }
        return {
            success: true,
            data: 'Account does not exist',
        } as DBDefaultResponse;
    }
}
