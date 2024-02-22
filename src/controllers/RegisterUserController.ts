import UserAuthHandler from '@/database/AccountHandler/Auth';
import UserRegisterHandler from '@/database/AccountHandler/Register';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function signUpController(userAccount: UserFromClient) {
    const register = new UserRegisterHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const checkDBResponse = await db.checkDB('signup controller');
    if (!checkDBResponse.success) return checkDBResponse;
    const authResponse = await auth.authUsername(userAccount.username.value);
    if (authResponse.success)
        return { success: false, data: authResponse.data };
    const registerResponse = await register.signUp(userAccount);
    if (!registerResponse.success) return registerResponse;
    const refreshDBResponse = await db.refreshDB('signup controller');
    if (!refreshDBResponse.success) return refreshDBResponse;
    return registerResponse;
}
