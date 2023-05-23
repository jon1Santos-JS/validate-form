export const INITIAL_STATE: MiniDBState = {
    accounts: [],
    limit: 10,
};
export const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';
export const ADMIN_ACCOUNT = {
    username: { value: 'admin1' },
    password: { value: 'admin1' },
};

export const SERVER_ERROR_RESPONSE = 'internal server error';

export const DATABASE: MiniDBType = { state: INITIAL_STATE };
DATABASE.state.accounts.push(ADMIN_ACCOUNT);
