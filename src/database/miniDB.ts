import { MongoClient, ServerApiVersion } from 'mongodb';

export const SERVER_ERROR_RESPONSE = 'internal server error';
export const MINI_DB_FILE_PATH_NAME = 'miniDBFile.json';

export const INITIAL_STATE: MiniDBState<null> = {
    _id: null,
    accounts: [],
    limit: 10,
};

export const DB_ADMIN_ACCOUNT: UserFromDataBaseType = {
    ID: '0',
    constraint: 'admin',
    username: { value: process.env.NEXT_PUBLIC_ADMINS_USERNAME as string },
    password: { value: process.env.NEXT_PUBLIC_ADMINS_PASSWORD as string },
    userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
};

export const DATABASE: MiniDBType<null> = { state: INITIAL_STATE };
DATABASE.state.accounts.push(DB_ADMIN_ACCOUNT);

// Create a Mongo Client Version
export const MONGODB = new MongoClient(process.env.MONGO_DB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1, // Api version
        strict: true, // Report errors when incompatible behaviors has been identified
        deprecationErrors: true, // Report errors when some deprecated methods were used
    },
});
