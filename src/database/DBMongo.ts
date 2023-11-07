import { DATABASE, DEFAULT_ERROR, INITIAL_STATE } from './DBState';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const MONGODB = new MongoClient(process.env.MONGO_DB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1, // Api version
        strict: true, // Report errors when incompatible behaviors has been identified
        deprecationErrors: true, // Report errors when some deprecated methods were used
    },
});

export class MongoDB {
    async connect(caller: string) {
        try {
            await MONGODB.connect();
            console.log('Connected to MongoDB by:', caller);
            return { success: true } as DBDefaultResponse;
        } catch {
            console.log('Failed to connect to MongoDB by:', caller);
            return {
                success: false,
                data: DEFAULT_ERROR,
            } as DBDefaultResponse;
        }
    }
    async accessState(caller: string) {
        const connectionResponse = await this.connect('access state');
        if (!connectionResponse.success) return connectionResponse;
        try {
            const collection = MONGODB.db('accounts').collection('users');
            const mongoResponse: unknown | null = await collection.findOne({});
            if (!mongoResponse) throw new Error('No state found');
            const DBState = {
                ...(mongoResponse as MiniDBState<null>),
                _id: null,
            } as MiniDBState<null>;
            DATABASE.state = DBState;
            console.log('MongoDB state has been accessed by:', caller);
            await MONGODB.close();
            return { success: true } as DBDefaultResponse;
        } catch {
            console.log('Failed to access MongoDB state by:', caller);
            return this.createState('access mongoDB state');
        }
    }
    async refreshState(caller: string) {
        const connectionResponse = await this.connect('access state');
        if (!connectionResponse.success) return connectionResponse;
        try {
            const collection = MONGODB.db('accounts').collection('users');
            const update = {
                $set: {
                    accounts: DATABASE.state.accounts,
                },
            };
            await collection.updateOne({}, update);
            console.log('MongoDB state has been refreshed by:', caller);
            return { success: true } as DBDefaultResponse;
        } catch {
            console.log('failed to refresh MongoDB state by:', caller);
            return { success: false, data: DEFAULT_ERROR } as DBDefaultResponse;
        } finally {
            await MONGODB.close();
        }
    }
    async createState(caller: string) {
        try {
            const collection = MONGODB.db('accounts').collection('users');
            const initialState = {
                accounts: INITIAL_STATE.accounts,
                limit: INITIAL_STATE.limit,
            };
            await collection.insertMany([initialState]);
            console.log('MongoDB state has been created by:', caller);
            return { success: true } as DBDefaultResponse;
        } catch {
            console.log('failed to create MongoDB state by:', caller);
            return { success: false, data: DEFAULT_ERROR } as DBDefaultResponse;
        } finally {
            await MONGODB.close();
        }
    }
}
