import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';
import { onOmitDBInputFields } from './inputHandler';

export async function getUserStateController() {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getUsers');
    if (typeof response === 'string') {
        console.log('controller error to get users: ', response);
        return { serverResponse: undefined };
    }
    const users = onOmitDBInputFields(response as UserFromDataBaseType[]);
    return { serverResponse: users };
}

export async function signInController(userAccount: UserFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signIn(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign in user: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: true };
}

export async function signUpController(userAccount: UserFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signUp(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign up user: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: true };
}
