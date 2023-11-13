import UserDeleteHandler from '@/database/AccountHandler/Delete';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function deleteAccountController(browserHash: string | undefined) {
    const deleteH = new UserDeleteHandler();
    const db = new DBHandler();
    const DBResponse = await db.getUserByHash(
        browserHash,
        'delete account controller',
    );
    if (!DBResponse.success) return DBResponse;
    const checkResponse = await db.checkDB('delete account controller');
    if (!checkResponse.success) return checkResponse;
    const user = DBResponse.data;
    const deleteResponse = await deleteH.deleteAccount(user);
    if (!deleteResponse.success) return deleteResponse;
    const refreshDBResponse = await db.refreshDB('delete account controller');
    if (!refreshDBResponse.success) return refreshDBResponse;
    return deleteResponse;
}
