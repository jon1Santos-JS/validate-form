export const INITIAL_STATE: MiniDBState = { accounts: [], limit: 10 };
export const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';
export const ADMIN_ACCOUNT = {
    username: { value: 'admin1' },
    password: { value: 'admin1' },
};

export const DataBase: MiniDBType = { state: INITIAL_STATE };
DataBase.state.accounts.push(ADMIN_ACCOUNT);
