import DBHandler from '@/database/DBHandler/DBhandler';

export async function resetDBController(browserHash: string | undefined) {
    const DB = new DBHandler();
    const DBResponse = await DB.getUserByHash(
        browserHash,
        'reset database controller',
    );
    if (!DBResponse.success) return DBResponse;
    const userFromDB = DBResponse.data;
    const response = await DB.resetDB(
        userFromDB.constraint,
        'reset database controller',
    );
    return response;
}
