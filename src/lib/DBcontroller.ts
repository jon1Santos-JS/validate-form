import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';

export async function onHandleDB(command: HandleDBComandType) {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB(command);
    return response;
}

export async function logIn(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const user = await accountsHandler.signIn(userAccount);
    if (!user) return;
    return user;
}

export async function signUp(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const user = await accountsHandler.signUp(userAccount);
    if (!user) return;
    return user;
}
