import DBAccountHandler from '@/database/accountHandler';
import { DEFAULT_ERROR } from '@/database/DB';
import DBHandler from '@/database/DBhandler';

export async function getUserStateController() {
    const DB = new DBHandler();
    const response = await DB.handleDB('getUsers')('getUsersState controller');
    if (typeof response === 'string') {
        console.log('controller error to get users: ', response);
        return { serverResponse: false, body: DEFAULT_ERROR };
    }
    return { serverResponse: true, body: response };
}

export async function signInController(userAccount: UserFromClient) {
    const accountHandler = new DBAccountHandler();
    const response = await accountHandler.signIn(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign in user: ', response);
        return { serverResponse: false, body: DEFAULT_ERROR };
    }
    return { serverResponse: true, body: userAccount.username.value };
}

export async function signUpController(userAccount: UserFromClient) {
    const accountHandler = new DBAccountHandler();
    const response = await accountHandler.signUp(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to sign up user: ', response);
        return { serverResponse: false, body: DEFAULT_ERROR };
    }
    return { serverResponse: true, body: 'Account has been created' };
}

export async function checkUsernameController(username: string) {
    const accountHandler = new DBAccountHandler();
    const response = await accountHandler.checkUsername(username);
    if (!response) {
        console.log('controller error to check username: ', response);
        return { serverResponse: false, body: DEFAULT_ERROR };
    }
    return { serverResponse: true, body: response };
}

export async function changePasswordController(
    userAccount: ChangePasswordFromClient,
) {
    const accountHandler = new DBAccountHandler();
    const response = await accountHandler.updatePassword(userAccount);
    if (typeof response === 'string') {
        console.log('controller error to change user password: ', response);
        return { serverResponse: false, body: DEFAULT_ERROR };
    }
    return { serverResponse: true, body: 'Account has been changed' };
}

export async function changeUsernameController(user: ChangeUsernameFromClient) {
    const accountHandler = new DBAccountHandler();
    const response = await accountHandler.updateUsername(user);
    if (typeof response === 'string') {
        console.log('controller error to change username: ', response);
        return { serverResponse: false, body: 'This username is already used' };
    }
    return { serverResponse: true, body: response };
}

export async function changeUserImgController(user: UserWithImg) {
    const accountHandler = new DBAccountHandler();
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

export async function deleteAccountController(username: string) {
    const accountHandler = new DBAccountHandler();
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

export async function resetDBController(username: string) {
    if (username !== process.env.NEXT_PUBLIC_ADMINS_USERNAME)
        return {
            serverResponse: false,
            body: 'Permission denied',
        };
    const DB = new DBHandler();
    const response = await DB.handleDB('resetDB')('resetDB controller');
    if (typeof response === 'string') {
        console.log('controller error to reset Database: ', response);
        return {
            serverResponse: false,
            body: DEFAULT_ERROR,
        };
    }
    return { serverResponse: true, body: 'Database has been reseted' };
}
