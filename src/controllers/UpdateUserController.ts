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
    const authResponse = await auth.authUsername(userAccount.newUsername.value);
    if (authResponse.success) return authResponse;
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
    const auth = new UserAuthHandler();
    const db = new DBHandler();
    const DBResponse1 = await db.getUserByHash(
        browserHash,
        'update image controller',
    );
    if (!DBResponse1.success) return DBResponse1;
    const user = DBResponse1.data;
    const authResponse = await auth.authUsername(user.username.value);
    if (!authResponse) return authResponse;
    const updateResponse = await update.updateUserImage(user, newUserImage);
    const DBResponse2 = await db.refreshDB('update image controller');
    if (!DBResponse2.success) return DBResponse2;
    return updateResponse;
}