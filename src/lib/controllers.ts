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

export async function checkUsernameController(username: string) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.checkUsername(username);
    if (!response) {
        console.log('controller error to check username: ', response);
        return { serverResponse: false, body: SERVER_ERROR_RESPONSE };
    }
    return { serverResponse: true, body: response };
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

export async function changeUserImgController(user: UserWithImgType) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.updateUserImage(user);
    if (typeof response === 'string') {
        console.log('controller error to change user image: ', response);
        return {
            success: false,
            data: response,
        } as ImageUpdateServerResponse;
    }
    return {
        success: true,
        data: response,
    } as ImageUpdateServerResponse;
}

export async function deleteAccountController(username: string) {
    const accountHandler = new MiniDBAccountHandler();
    const response = await accountHandler.excludeUserAccount(username);
    if (typeof response === 'string') {
        console.log('controller error to delete user account: ', response);
        return {
            serverResponse: false,
            body: 'Error when try to delete user account',
        };
    }
    return { serverResponse: true, body: 'User has been deleted' };
}

export async function resetDBController(username: string) {
    if (username !== process.env.NEXT_PUBLIC_ADMINS_USERNAME)
        return {
            serverResponse: false,
            body: 'Permission denied',
        };
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('resetDB')('resetDB controller');
    if (typeof response === 'string') {
        console.log('controller error to reset Database: ', response);
        return {
            serverResponse: false,
            body: response,
        };
    }
    return { serverResponse: true, body: 'Database has been reseted' };
}
