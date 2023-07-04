import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';
import { onOmitDBInputFields } from './inputHandler';
import { SERVER_ERROR_RESPONSE } from '@/database/miniDB';

export async function getUserStateController() {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getUsers');
    if (typeof response === 'string') {
        console.log('controller error to get users: ', response);
        return { serverResponse: undefined, body: SERVER_ERROR_RESPONSE };
    }
    const users = onOmitDBInputFields(response as UserFromDataBaseType[]);
    return { serverResponse: true, body: users };
}

export async function signInController(userAccount: AccountFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signIn(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign in user: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: userAccount.username.value };
}

export async function signUpController(userAccount: AccountFromClientType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signUp(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign up user: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: 'Account has been created' };
}

export async function changePasswordController(
    userAccount: ChangePasswordFromClientType,
) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.updatePassword(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to change user password: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: 'Account has been changed' };
}

export async function changeUsernameController(
    user: ChangeUsernameFromClientType,
) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.updateUsername(user);
    if (typeof response === 'string') {
        console.log('controller error to change username: ', response);
        return { serverResponse: false, body: 'This username is already used' };
    }
    return { serverResponse: true, body: response };
}
