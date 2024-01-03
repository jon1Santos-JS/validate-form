import UserAuthHandler from '@/database/AccountHandler/Auth';
import UserUpdateHandler from '@/database/AccountHandler/Update';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function updateUsernameController(
    userAccount: UserWithNewUsername,
) {
    const update = new UserUpdateHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const checkDBResponse = await db.checkDB('update username controller');
    if (!checkDBResponse.success) return checkDBResponse;
    const accountResponse = await auth.authAccount({
        username: userAccount.username,
        password: userAccount.password,
    });
    if (!accountResponse.success) return accountResponse;
    const authResponse = await auth.authUsername(userAccount.newUsername.value);
    if (authResponse.success)
        return {
            success: false,
            data: authResponse.data,
        };
    const updateResponse = await update.updateUsername(userAccount);
    if (!updateResponse.success) return updateResponse;
    const DBResponse = await db.refreshDB('update username controller');
    if (!DBResponse.success) return DBResponse;
    return updateResponse;
}

export async function updatePasswordController(
    userAccount: UserWithNewPassword,
) {
    const update = new UserUpdateHandler();
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const checkResponse = await db.checkDB('update password controller');
    if (!checkResponse.success) return checkResponse;
    const authResponse = await auth.authAccount(userAccount);
    if (!authResponse.success) return authResponse;
    const updateResponse = await update.updatePassword(userAccount);
    const DBResponse = await db.refreshDB('update password controller');
    if (!DBResponse.success) return DBResponse;
    return updateResponse;
}

export async function updateUserImageController(
    browserHash: string | undefined,
    newUserImage: NewUserImage,
) {
    const update = new UserUpdateHandler();
    const db = new DBHandler();
    const checkResponse = await db.checkDB('update image controller');
    if (!checkResponse.success) return checkResponse;
    const getUserResponse = await db.getUserByHash(
        browserHash,
        'update image controller',
    );
    if (!getUserResponse.success) return getUserResponse;
    const user = getUserResponse.data;
    const updateResponse = await update.updateUserImage(user, newUserImage);
    const refreshResponse = await db.refreshDB('update image controller');
    if (!refreshResponse.success) return refreshResponse;
    return updateResponse;
}
