import { onAddInputFields } from '@/lib/inputHandler';
import { DATABASE } from '../DBHandler/DBState';

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
}
