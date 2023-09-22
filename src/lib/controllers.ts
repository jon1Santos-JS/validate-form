import MiniDBAccountHandler from '@/database/accountHandler';
import { SERVER_ERROR_RESPONSE } from '@/database/miniDB';
import MiniDBHandler from '@/database/miniDBHandler';

export async function getUserStateController() {
    const jsonDB = new MiniDBHandler();
    const response = await jsonDB.handleDB('getUsers')(
        'getUsersState controller',
    );
    if (typeof response === 'string') {
        console.log('controller error to get users: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: response };
}

export async function signInController(userAccount: UserFromClientType) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.signIn(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign in user: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: userAccount.username.value };
}

export async function signUpController(userAccount: UserFromClientType) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.signUp(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign up user: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: 'Account has been created' };
}

export async function changePasswordController(
    userAccount: ChangePasswordFromClientType,
) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.updatePassword(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to change user password: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: 'Account has been changed' };
}

export async function changeUsernameController(
    user: ChangeUsernameFromClientType,
) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.updateUsername(user);
    if (typeof response === 'string') {
        console.log('controller error to change username: ', response);
        return { serverResponse: false, body: 'This username is already used' };
    }
    return { serverResponse: true, body: response };
}

export async function changeUserImg(user: UserWithImgType) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.updateUserImage(user);
    if (typeof response === 'string') {
        console.log('controller error to change user image: ', response);
        return {
            serverResponse: false,
            body: 'Error when try to update the image',
        };
    }
    return { serverResponse: true, body: 'User image has been updated' };
}

export async function deleteAccount(username: string) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.excludeUserAccount(username);
    if (typeof response === 'string') {
        console.log('controller error to exclude user account: ', response);
        return {
            serverResponse: false,
            body: 'Error when try to delete user account',
        };
    }
    return { serverResponse: true, body: 'User has been deleted' };
}
