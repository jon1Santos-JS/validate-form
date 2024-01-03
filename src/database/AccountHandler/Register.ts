import { DATABASE } from '../DBHandler/DBState';

export default class UserRegisterHandler {
    async signUp(userAccount: UserFromClient) {
        const userAccountHandled: UserFromDataBase =
            this.onAddInputFields(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        return {
            success: true,
            data: 'Account has been created',
        } as DBDefaultResponse;
    }

    onAddInputFields(userAccount: UserFromClient) {
        const handledUserAccount = {
            ID: DATABASE.state.accounts.length.toString(),
            constraint: 'user',
            ...userAccount,
            userImage: process.env
                .NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        };
        return handledUserAccount as UserFromDataBase;
    }
}
