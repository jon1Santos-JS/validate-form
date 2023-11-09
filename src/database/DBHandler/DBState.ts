export const DB_ADMIN_ACCOUNT: UserFromDataBase = {
    ID: '0',
    constraint: 'admin',
    username: { value: process.env.NEXT_PUBLIC_ADMINS_USERNAME as string },
    password: { value: process.env.NEXT_PUBLIC_ADMINS_PASSWORD as string },
    userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
};

export const INITIAL_STATE: MiniDBState<null> = {
    _id: null,
    accounts: [DB_ADMIN_ACCOUNT],
    limit: 10,
};

export const DATABASE: MiniDBType<null> = { state: INITIAL_STATE };

export const DEFAULT_ERROR = 'internal server error';
