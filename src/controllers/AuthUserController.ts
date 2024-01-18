import UserAuthHandler from '@/database/AccountHandler/Auth';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function signInController(userAccount: UserFromClient) {
    const DB = new DBHandler();
    const DBResponse = await DB.connect('sign in controller');
    if (!DBResponse.success) return DBResponse;
    const accountHandler = new UserAuthHandler();
    const response = await accountHandler.authAccount(userAccount);
    return response;
}

export async function authUserController(browserHash: string | undefined) {
    const DB = new DBHandler();
    const response = await DB.getUserByHash(
        browserHash,
        'auth user controller',
    );
    if (!response.success) return response;
    return {
        success: true,
        data: {
            username: response.data.username.value,
            userImage: response.data.userImage,
        },
    } as AuthUserResponse;
}

export async function checkUsernameController(username: string) {
    const db = new DBHandler();
    const auth = new UserAuthHandler();
    const DBResponse = await db.connect('check username controller');
    if (!DBResponse.success) return DBResponse;
    const authResponse = await auth.authUsername(username);
    return authResponse;
}
