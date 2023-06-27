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

export async function signInController(userAccount: AccountFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signIn(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign in user: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: userAccount.username.value };
}

export async function signUpController(userAccount: AccountFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signUp(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign up user: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: true };
}

export async function changePasswordController(
    userAccount: ChangePasswordFromClientType,
) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.updatePassword(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to change user password: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: true };
}

export async function changeUsernameController(
    user: ChangeUsernameFromClientType,
) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.updateUsername(user);
    if (typeof response === 'string') {
        console.log('controller error to change username: ', response);
        return { serverResponse: false };
    }
    return { serverResponse: response };
}
