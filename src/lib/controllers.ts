import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';
import { onValidateHash } from './hash';
import { onOmitDBInputFields } from './inputHandler';

export async function getUserStateController(hash: string | undefined) {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getUsers');
    if (typeof response === 'string') {
        console.log('controller error to get users: ', response);
        return { serverResponse: false };
    }
    const users = onOmitDBInputFields(response as UserFromDataBaseType[]);
    const validatedHash = await onValidateHash(hash, users);
    if (typeof validatedHash === 'string') {
        console.log('controller error to validate hash: ', validatedHash);
        return { serverResponse: false };
    }
    return { serverResponse: true };
}

export async function getDBStateController() {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getDB');
    if (typeof response === 'string') {
        console.log('controller error to get database: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: response as MiniDBState };
}

export async function resetDBStateController(command: 'reset') {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB(command);
    if (typeof response === 'string') {
        console.log('controller error to reset DB: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: true };
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