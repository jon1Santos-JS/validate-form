export const INITIAL_STATE: MiniDBState = {
    accounts: [],
    limit: 10,
};
export const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';
export const ADMIN_ACCOUNT: UserFromDataBaseType = {
    ID: 1,
    constraint: 'admin',
    username: { value: process.env.ADMIN_USERNAME as string },
    password: { value: process.env.ADMIN_PASSWORD as string },
};

export const SERVER_ERROR_RESPONSE = 'internal server error';

export const DATABASE: MiniDBType = { state: INITIAL_STATE };
DATABASE.state.accounts.push(ADMIN_ACCOUNT);
