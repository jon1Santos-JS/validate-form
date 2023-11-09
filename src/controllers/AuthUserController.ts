import UserAuthHandler from '@/database/AccountHandler/Auth';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function signInController(userAccount: UserFromClient) {
    const accountHandler = new UserAuthHandler();
    const response = await accountHandler.authAccount(userAccount);
    return response;
}

export async function checkUsernameController(username: string) {
    const db = new DBHandler();
    const refreshDBResponse = await db.refreshDB('signup controller');
    if (!refreshDBResponse.success) return refreshDBResponse;
    const auth = new UserAuthHandler();
    const authResponse = await auth.authUsername(username);
    return authResponse;
}
