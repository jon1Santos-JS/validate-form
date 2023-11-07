import UserAuthHandler from '@/database/AccountHandler/Auth';
import UserRegisterHandler from '@/database/AccountHandler/Register';
import UserUpdateHandler from '@/database/AccountHandler/Update';
import DBHandler from '@/database/DBhandler';

export async function getUserStateController() {
    const DB = new DBHandler();
    const response = await DB.handleDB('getUsers', 'get userstate controller');
    return response;
}

export async function signInController(userAccount: UserFromClient) {
    const accountHandler = new UserAuthHandler();
    const response = await accountHandler.authAccount(userAccount);
    return response;
}

export async function signUpController(userAccount: UserFromClient) {
    const register = new UserRegisterHandler();
    const db = new DBHandler();
    const auth = new UserAuthHandler();
    const checkDBResponse = await db.handleDB(
        'checkDBState',
        'signup controller',
    );
    if (!checkDBResponse.success) return checkDBResponse;
    const refreshDBResponse1 = await db.handleDB(
        'refreshDB',
        'signup controller refresh for auth',
    );
    if (!refreshDBResponse1.success) return refreshDBResponse1;
    const authResponse = await auth.authUsername(userAccount);
    if (!authResponse.success) return authResponse;
    const registerResponse = await register.signUp(userAccount);
    if (!registerResponse.success) return registerResponse;
    const refreshDBResponse = await db.handleDB(
        'refreshDB',
        'signup controller refresh after sign up',
    );
    if (!refreshDBResponse.success) return refreshDBResponse;
    return registerResponse;
}

export async function checkUsernameController(userAccount: UserFromClient) {
    const db = new DBHandler();
    const refreshDBResponse = await db.handleDB(
        'refreshDB',
        'signup controller',
    );
    if (!refreshDBResponse.success) return refreshDBResponse;
    const auth = new UserAuthHandler();
    const authResponse = await auth.authUsername(userAccount);
    return authResponse;
}

export async function updateUsernameController(
    userAccount: UserFromClient,
    newUsername: NewUsernameFromClient,
) {
    const update = new UserUpdateHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const authResponse = await auth.authUsername({
        ...userAccount,
        username: newUsername,
    });
    if (authResponse.success)
        return {
            success: false,
            data: 'Username already exist',
        } as DBAuthResponse;
    const updateResponse = await update.updateUsername(
        userAccount,
        newUsername,
    );
    if (!updateResponse.success) return updateResponse;
    const DBResponse = await db.handleDB(
        'refreshDB',
        'update username controller',
    );
    if (!DBResponse.success) return DBResponse;
    return updateResponse;
}

export async function updatePasswordController(
    userAccount: UserFromClient,
    newPassword: NewPasswordFromClient,
) {
    const update = new UserUpdateHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const authResponse = await auth.authAccount(userAccount);
    if (!authResponse.success) return authResponse;
    const updateResponse = await update.updatePassword(
        userAccount,
        newPassword,
    );
    const DBResponse = await db.handleDB('refreshDB', 'change password');
    if (!DBResponse.success) return DBResponse;
    return updateResponse;
}

export async function updateUserImageController(
    userAccount: UserFromClient,
    newUserImage: NewUserImage,
) {
    const update = new UserUpdateHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const authResponse = await auth.authUsername(userAccount);
    if (!authResponse) return authResponse;
    const updateResponse = await update.updateUserImage(
        userAccount,
        newUserImage,
    );
    const DBResponse = await db.handleDB(
        'refreshDB',
        'update user image controller',
    );
    if (!DBResponse.success) return DBResponse;
    return updateResponse;
}

export async function deleteAccountController(userAccount: UserFromClient) {
    const register = new UserRegisterHandler();
    const db = new DBHandler();
    const registerResponse = await register.deleteAccount(userAccount);
    const refreshDBResponse = await db.handleDB(
        'refreshDB',
        'delete account controller',
    );
    if (!refreshDBResponse.success) return refreshDBResponse;
    return registerResponse;
}

export async function resetDBController(userAccount: UserFromClient) {
    const Auth = new UserAuthHandler();
    const authResponse = await Auth.authAccount(userAccount);
    if (!authResponse.success) return authResponse;
    const userFromDB = authResponse.data;
    if (userFromDB.constraint !== 'admin')
        return {
            success: false,
            data: 'Permission denied',
        } as DBDefaultResponse;
    const DB = new DBHandler();
    const response = await DB.handleDB('resetDB', 'reset DB controller');
    return response;
}
