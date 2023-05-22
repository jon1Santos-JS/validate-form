import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';

export async function handleDBController(command: HandleDBComandType) {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB(command);
    return response;
}

export async function signInController(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const user = await accountsHandler.signIn(userAccount);
    if (!user) return;
    const parsedUser: SignInResponseType = JSON.parse(user);
    return parsedUser;
}

export async function signUpController(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const user = await accountsHandler.signUp(userAccount);
    if (!user) return;
    return user;
}
