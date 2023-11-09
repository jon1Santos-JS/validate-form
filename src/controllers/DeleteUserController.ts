import UserDeleteHandler from '@/database/AccountHandler/Delete';
import DBHandler from '@/database/DBHandler/DBhandler';

export async function deleteAccountController(browserHash: string | undefined) {
    const deleteH = new UserDeleteHandler();
    const db = new DBHandler();
    const DBResponse = await db.getUserByHash(browserHash);
    if (!DBResponse.success) return DBResponse;
    const user = DBResponse.data;
    const deleteResponse = await deleteH.deleteAccount(user);
    const refreshDBResponse = await db.refreshDB('delete account controller');
    if (!refreshDBResponse.success) return refreshDBResponse;
    return deleteResponse;
}
