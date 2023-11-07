import { DATABASE } from '../DBState';

export default class UserRegisterHandler {
    async signUp(userAccount: UserFromClient) {
        const userAccountHandled: UserFromDataBase =
            onAddInputFields(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        return {
            success: true,
            data: 'Account has been created',
        } as DBDefaultResponse;
    }

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

function onAddInputFields(userAccount: UserFromClient) {
    const handledUserAccount = {
        ID: DATABASE.state.accounts.length.toString(),
        constraint: 'user',
        ...userAccount,
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    };
    return handledUserAccount as UserFromDataBase;
}
