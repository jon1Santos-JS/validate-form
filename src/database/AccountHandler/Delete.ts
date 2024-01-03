import { DATABASE } from '../DBHandler/DBState';

export default class UserDeleteHandler {
    async deleteAccount(userAccount: UserFromClient) {
        DATABASE.state.accounts = DATABASE.state.accounts.filter(
            (DBAccount) =>
                DBAccount.username.value !== userAccount.username.value,
        );

        return {
            success: true,
            data: 'Account has been deleted',
        } as DBDefaultResponse;
    }
}
